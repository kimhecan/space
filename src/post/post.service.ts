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
import { ChatModel } from 'src/chat/entity/chat.entity';
import { ExtendedPostModel } from 'src/post/type';
import { SpaceModel } from 'src/space/entity/space.entity';
import { SpaceService } from 'src/space/space.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostModel)
    private postRepository: Repository<PostModel>,
    @InjectRepository(SpaceModel)
    private spaceRepository: Repository<SpaceModel>,
    @InjectRepository(UserSpaceModel)
    private userSpaceRepository: Repository<UserSpaceModel>,
    @InjectRepository(SpaceRoleModel)
    private spaceRoleRepository: Repository<SpaceRoleModel>,
    @InjectRepository(ChatModel)
    private chatRepository: Repository<ChatModel>,
    private readonly spaceService: SpaceService,
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

    const role = await this.spaceRoleRepository.findOne({
      where: {
        name: roleName,
      },
    });

    // 참여자는 "질문"만 작성할 수 있습니다.
    if (role.type === 'participant' && createPostDto.type === 'Notice') {
      throw new UnauthorizedException('공지사항을 작성할 권한이 없습니다.');
    }

    // 익명 상태로 게시글을 작성할 수 있는 것은 “참여자"뿐입니다.
    if (role.type === 'admin' && createPostDto.anonymous) {
      throw new BadRequestException(
        'admin 권한인 유저가 익명으로 게시글을 작성할 수 없습니다.',
      );
    }

    // “질문" 게시글은 익명 상태로 작성하는 것이 가능
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

  async getPost(spaceId: number, postId: number, userId: number) {
    const post = await this.postRepository.findOne({
      where: {
        id: postId,
        space: {
          id: spaceId,
        },
      },
      relations: [
        'user',
        'chats',
        'chats.user',
        'chats.replies',
        'chats.replies.user',
      ],
    });

    if (!post) {
      throw new NotFoundException('게시글이 존재하지 않습니다.');
    }

    const { isAdminUser, isPostOwner } = await this.getPostOwnerAndAdminUser(
      spaceId,
      post.user.id,
      userId,
    );

    // 익명 상태로 작성된 게시글은 작성자 본인 또는 관리자만 조회 가능
    return this.removeUserInfoForAnonymous({
      post,
      isPostOwner,
      isAdminUser,
      userId,
    });
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
      relations: [
        'user',
        'chats',
        'chats.user',
        'chats.replies',
        'chats.replies.user',
      ],
    });

    const postStats = await Promise.all(
      posts.map(async (post) => {
        const chatCount = post.chats.filter(
          (chat) => chat.user.id !== post.user.id,
        ).length;
        const uniqueChatters = new Set(
          post.chats
            .filter((chat) => chat.user.id !== post.user.id)
            .map((chat) => chat.user.id),
        ).size;
        return { post, chatCount, uniqueChatters };
      }),
    );

    const sortedPosts = postStats
      .sort((a, b) => {
        if (a.chatCount === b.chatCount) {
          return b.uniqueChatters - a.uniqueChatters;
        }
        return b.chatCount - a.chatCount;
      })
      .slice(0, 5);

    const popularPostsIds = new Set(sortedPosts.map((item) => item.post.id));

    const anonymousProcessedPosts = await Promise.all(
      posts.map(async (post) => {
        const { isPostOwner, isAdminUser } =
          await this.getPostOwnerAndAdminUser(spaceId, post.user.id, userId);

        return this.removeUserInfoForAnonymous({
          post,
          isPostOwner,
          isAdminUser,
          userId,
        });
      }),
    );

    const popularProcessedPosts = await Promise.all(
      anonymousProcessedPosts.map(async (post) => {
        const newPost = { ...post } as ExtendedPostModel;
        if (popularPostsIds.has(post.id)) {
          newPost.isPopular = true;
        } else {
          newPost.isPopular = false;
        }
        return newPost;
      }),
    );

    return popularProcessedPosts;
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

    const isSpaceOwner = await this.spaceService.isSpaceOwner(
      this.spaceRepository,
      userId,
      spaceId,
    );

    const spaceRole = await this.spaceRoleRepository.findOne({
      where: {
        name: userSpaceRole.roleName,
      },
    });

    const isAdminUser = spaceRole.type === 'admin' || isSpaceOwner;

    if (!isPostOwner && !isAdminUser) {
      throw new UnauthorizedException('게시글을 삭제할 권한이 없습니다.');
    }

    await Promise.all([
      this.chatRepository.softDelete({
        post: {
          id: postId,
        },
      }),
      this.postRepository.softDelete({
        id: postId,
        space: {
          id: spaceId,
        },
      }),
    ]);
  }

  async getPostOwnerAndAdminUser(
    spaceId: number,
    postUserId: number,
    userId: number,
  ) {
    const isPostOwner = postUserId === userId;

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

    const spaceRole = await this.spaceRoleRepository.findOne({
      where: {
        name: userSpaceRole.roleName,
      },
    });

    const isSpaceOwner = await this.spaceService.isSpaceOwner(
      this.spaceRepository,
      userId,
      spaceId,
    );

    const isAdminUser = spaceRole.type === 'admin' || isSpaceOwner;

    return {
      isPostOwner,
      isAdminUser,
    };
  }

  async removeUserInfoForAnonymous({
    post,
    isPostOwner,
    isAdminUser,
    userId,
  }: {
    post: PostModel;
    isPostOwner: boolean;
    isAdminUser: boolean;
    userId: number;
  }) {
    // 메인 게시글이 익명이고 사용자가 게시글의 소유자나 관리자가 아닌 경우, 게시글의 사용자 정보를 제거
    if (post.anonymous && !(isPostOwner || isAdminUser)) {
      post.user = null;
    }

    // 각 채팅과 대댓글에서도 익명 여부를 확인하고, 조건에 따라 사용자 정보 제거
    post.chats.forEach((chat) => {
      this.removeUserFromChat(chat, userId, isAdminUser);
    });

    return post;
  }

  private removeUserFromChat(
    chat: ChatModel,
    userId: number,
    isAdminUser: boolean,
  ) {
    // 채팅이 익명이고 사용자가 채팅의 소유자나 관리자가 아닌 경우, 채팅의 사용자 정보를 제거
    const isChatOwner = chat.user.id === userId;
    if (chat.anonymous && !(isChatOwner || isAdminUser)) {
      chat.user = null;
    }

    // 각 대댓글에 대해서도 동일한 조건 적용
    chat.replies.forEach((reply) => {
      this.removeUserFromReply(reply, userId, isAdminUser);
    });
  }

  private removeUserFromReply(
    reply: ChatModel,
    userId: number,
    isAdminUser: boolean,
  ) {
    // 대댓글이 익명이고 사용자가 대댓글의 소유자나 관리자가 아닌 경우, 대댓글의 사용자 정보를 제거
    const isReplyOwner = reply.user.id === userId;
    if (reply.anonymous && !(isReplyOwner || isAdminUser)) {
      reply.user = null;
    }
  }
}
