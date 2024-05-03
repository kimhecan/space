import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatModel } from 'src/chat/entity/chat.entity';
import { InteractionModel } from 'src/interaction/entity/interaction.entity';
import { PostModel } from 'src/post/entity/post.entity';
import { SpaceRoleModel } from 'src/space/entity/space-role.entity';
import { UserSpaceModel } from 'src/user/entity/user-space.entity';
import { UserModel } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InteractionService {
  constructor(
    @InjectRepository(InteractionModel)
    private interactionRepository: Repository<InteractionModel>,
    @InjectRepository(PostModel)
    private postRepository: Repository<PostModel>,
    @InjectRepository(ChatModel)
    private chatRepository: Repository<ChatModel>,
    @InjectRepository(SpaceRoleModel)
    private spaceRoleRepository: Repository<SpaceRoleModel>,
    @InjectRepository(UserSpaceModel)
    private userSpaceRepository: Repository<UserSpaceModel>,
    @InjectRepository(UserModel)
    private userRepository: Repository<UserModel>,
  ) {}

  async postCurious(postId: number, userId: number, spaceId: number) {
    const isExistInteraction = await this.interactionRepository.exists({
      where: {
        post: {
          id: postId,
        },
        user: {
          id: userId,
        },
        space: {
          id: spaceId,
        },
      },
    });

    if (isExistInteraction) {
      await this.interactionRepository.softDelete({
        post: {
          id: postId,
        },
        user: {
          id: userId,
        },
        space: {
          id: spaceId,
        },
      });

      return {
        message: '삭제되었습니다.',
      };
    } else {
      await this.interactionRepository.save({
        post: {
          id: postId,
        },
        user: {
          id: userId,
        },
        space: {
          id: spaceId,
        },
      });

      return {
        message: '등록되었습니다.',
      };
    }
  }

  async chatLike(chatId: number, userId: number, spaceId: number) {
    const isExistInteraction = await this.interactionRepository.exists({
      where: {
        chat: {
          id: chatId,
        },
        user: {
          id: userId,
        },
        space: {
          id: spaceId,
        },
      },
    });

    if (isExistInteraction) {
      await this.interactionRepository.softDelete({
        chat: {
          id: chatId,
        },
        user: {
          id: userId,
        },
        space: {
          id: spaceId,
        },
      });

      return {
        message: '삭제되었습니다.',
      };
    } else {
      await this.interactionRepository.save({
        chat: {
          id: chatId,
        },
        user: {
          id: userId,
        },
        space: {
          id: spaceId,
        },
      });

      return {
        message: '등록되었습니다.',
      };
    }
  }

  async getStatistic(spaceId: number, userId: number) {
    const [userSpaces, interactions, spaceRoles, posts] = await Promise.all([
      this.userSpaceRepository.find({
        where: {
          space: {
            id: spaceId,
          },
        },
        relations: ['user'],
      }),
      this.interactionRepository.find({
        where: {
          space: {
            id: spaceId,
          },
        },
        relations: ['user', 'user.userSpace'],
      }),
      this.spaceRoleRepository.find({
        where: {
          space: {
            id: spaceId,
          },
        },
      }),
      this.postRepository.find({
        where: {
          space: {
            id: spaceId,
          },
        },
        relations: [
          'interactions',
          'user',
          'chats',
          'chats.user',
          'chats.interactions',
        ],
      }),
    ]);

    const userRole = userSpaces.find((us) => us.user.id === userId).roleName;

    /**
     * 공간에서 일어난 평균 인터렉션 수
     */
    const averageInteractionPerUser = Math.round(
      interactions.length / userSpaces.length,
    );

    /**
     * 본인이 보낸 인터렉션 수
     */
    const userSentInteractionCount = interactions.filter(
      (interaction) => interaction.user.id === userId,
    ).length;

    /**
     * 본인이 받은 인터렉션 수
     */
    const userReceivedInteractionCount = posts
      .filter((post) => post.user.id === userId)
      .reduce((totalInteractions, post) => {
        // 게시글에서 받은 인터렉션 수
        totalInteractions += post.interactions.length;

        // 댓글에서 받은 인터렉션 수
        totalInteractions += post.chats.reduce(
          (totalLikes, chat) => totalLikes + chat.interactions.length,
          0,
        );

        return totalInteractions;
      }, 0);

    /**
     * 역할별로 보낸 인터렉션 수와 받은 인터렉션 수 계산
     */
    const rolesInteractions = spaceRoles.map((role) => {
      const RoleName = role.name;

      // 인터렉션중 해당 인터렉션의 유저가 해당 역할을 가지고 있는지 확인
      const interactionsOfRole = interactions.filter((interaction) => {
        return interaction.user.userSpace.find(
          (us) => us.roleName === RoleName,
        );
      });

      // 우선 보낸 인터렉션 먼저 계산
      return {
        role: role.name,
        interaction: {
          send: interactionsOfRole.length,
          receive: 0,
        },
      };
    });

    // 역할별로 받은 인터렉션 계산
    posts.forEach((post) => {
      const postUserRoleName = userSpaces.find(
        (us) => us.user.id === post.user.id,
      ).roleName;

      rolesInteractions.forEach((role) => {
        if (role.role === postUserRoleName) {
          role.interaction.receive += post.interactions.length;
        }
      });

      post.chats.forEach((chat) => {
        const chatUserRoleName = userSpaces.find(
          (us) => us.user.id === chat.user.id,
        ).roleName;

        rolesInteractions.forEach((role) => {
          if (role.role === chatUserRoleName) {
            role.interaction.receive += chat.interactions.length;
          }
        });
      });
    });

    return {
      rolesInteractions,
      userRole: userRole,
      userSentInteractionCount,
      userReceivedInteractionCount,
      averageInteractionPerUser,
    };
  }
}
