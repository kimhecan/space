import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatModel } from 'src/chat/entity/chat.entity';
import { SpaceRoleModel } from 'src/space/entity/space-role.entity';
import { UserSpaceModel } from 'src/user/entity/user-space.entity';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatModel)
    private chatRepository: Repository<ChatModel>,
    @InjectRepository(UserSpaceModel)
    private userSpaceRepository: Repository<UserSpaceModel>,
    @InjectRepository(SpaceRoleModel)
    private SpaceRoleRepository: Repository<SpaceRoleModel>,
  ) {}

  async createChat(
    createChatDto: CreateChatDto,
    userId: number,
    postId: number,
  ) {
    const chat = this.chatRepository.create({
      ...createChatDto,
      user: {
        id: userId,
      },
      post: {
        id: postId,
      },
      parent: {
        id: createChatDto.parentId,
      },
    });

    return await this.chatRepository.save(chat);
  }

  async findChatFromPost(postId: number) {
    const chats = await this.chatRepository.find({
      where: { post: { id: postId } },
      relations: ['user'],
    });
    return chats;
  }

  async findChatFromMe(userId: number) {
    const chats = await this.chatRepository.find({
      where: { user: { id: userId } },
    });
    return chats;
  }

  async removeChat({
    userId,
    spaceId,
    postId,
    chatId,
  }: {
    userId: number;
    spaceId: number;
    postId: number;
    chatId: number;
  }) {
    const chat = await this.chatRepository.findOne({
      where: {
        id: chatId,
      },
      relations: ['user'],
    });

    if (!chat) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }

    const isChatOwner = chat.user.id === userId;

    const userSpaceRole = await this.userSpaceRepository.findOne({
      where: {
        space: {
          id: spaceId,
        },
        user: {
          id: userId,
        },
      },
    });

    const spaceRole = await this.SpaceRoleRepository.findOne({
      where: {
        name: userSpaceRole.roleName,
      },
    });

    const isAdminUser = spaceRole.type === 'admin';

    if (!isChatOwner && !isAdminUser) {
      throw new UnauthorizedException('댓글을 삭제할 권한이 없습니다.');
    }

    return await this.chatRepository.softDelete({
      id: chatId,
      post: {
        id: postId,
      },
    });
  }
}
