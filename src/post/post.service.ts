import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostModel } from 'src/post/entity/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UserSpaceModel } from 'src/user/entity/user-space.entity';
import { SpaceRoleModel } from 'src/space/entity/space-role.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostModel)
    private postRepository: Repository<PostModel>,
    @InjectRepository(UserSpaceModel)
    private userSpaceRepository: Repository<UserSpaceModel>,
    @InjectRepository(SpaceRoleModel)
    private SpaceRoleRepository: Repository<SpaceRoleModel>,
  ) {}

  async userExistsInSpace(spaceId: number, userId: number) {
    return await this.userSpaceRepository.findOne({
      where: {
        space: {
          id: spaceId,
        },
        user: {
          id: userId,
        },
      },
    });
  }

  async createPost(
    spaceId: number,
    userId: number,
    createPostDto: CreatePostDto,
  ) {
    const userExistsInSpace = await this.userExistsInSpace(spaceId, userId);

    if (!userExistsInSpace) {
      throw new UnauthorizedException('유저가 공간에 존재하지 않습니다.');
    }

    const roleName = userExistsInSpace.roleName;

    const role = await this.SpaceRoleRepository.findOne({
      where: {
        name: roleName,
      },
    });

    if (role.type === 'participant' && createPostDto.type === 'Notice') {
      throw new UnauthorizedException('공지사항을 작성할 권한이 없습니다.');
    }

    if (createPostDto.type === 'Notice' && createPostDto.anonymous) {
      throw new BadRequestException('익명으로 공지사항을 작성할 수 없습니다.');
    }

    const post = await this.postRepository.save({
      ...createPostDto,
      space: {
        id: spaceId,
      },
      user: {
        id: userId,
      },
    });

    return post;
  }

  async listPostFromSpace(spaceId: number, userId: number) {
    const userExistsInSpace = await this.userExistsInSpace(spaceId, userId);

    if (!userExistsInSpace) {
      throw new UnauthorizedException('유저가 공간에 존재하지 않습니다.');
    }

    const posts = await this.postRepository.find({
      where: {
        space: {
          id: spaceId,
        },
      },
      relations: ['chats', 'chats.user'],
    });

    return posts;
  }

  async listPostFromMe(userId: number) {
    const posts = await this.postRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });

    return posts;
  }

  async deletePost(spaceId: number, postId: number, userId: number) {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
      },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('게시글이 존재하지 않습니다.');
    }

    const isPostOwner = post.user.id === userId;

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

    if (!isPostOwner && !isAdminUser) {
      throw new UnauthorizedException('게시글을 삭제할 권한이 없습니다.');
    }

    await this.postRepository.delete({
      id: postId,
      space: {
        id: spaceId,
      },
    });
  }
}
