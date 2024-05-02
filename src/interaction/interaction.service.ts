import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatModel } from 'src/chat/entity/chat.entity';
import { InteractionModel } from 'src/interaction/entity/interaction.entity';
import { PostModel } from 'src/post/entity/post.entity';
import { SpaceRoleModel } from 'src/space/entity/space-role.entity';
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
  ) {}

  async postCurious(postId: number, userId) {
    const isExistInteraction = await this.interactionRepository.exists({
      where: {
        post: {
          id: postId,
        },
        user: {
          id: userId,
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
      });

      return {
        message: '등록되었습니다.',
      };
    }
  }

  async chatLike(chatId: number, userId: number) {
    const isExistInteraction = await this.interactionRepository.exists({
      where: {
        chat: {
          id: chatId,
        },
        user: {
          id: userId,
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
      });

      return {
        message: '등록되었습니다.',
      };
    }
  }

  async getStatistic(spaceId: number, userId: number) {
    // 각 사용자가 보낸 "저도 궁금해요" 정보
    const sentCuriousCountGroupByUser = await this.interactionRepository
      .createQueryBuilder('interaction')
      .select('interaction.userId', 'userId')
      .addSelect('COUNT(interaction.id)', 'sentCuriousCount')
      .leftJoin('interaction.post', 'post')
      .where('post.spaceId = :spaceId', {
        spaceId,
      })
      .groupBy('interaction.userId')
      .getRawMany();

    // 각 사용자가 보낸 "저도 궁금해요" 수의 평균
    const averageSentCuriosCountPerUser = this.calculateAverage(
      sentCuriousCountGroupByUser,
      'sentCuriousCount',
    );

    // 본인이 보낸 "저도 궁금해요" 수 (없으면 0)
    const userSentCuriousCount = this.findUserInteractionCount(
      sentCuriousCountGroupByUser,
      userId,
      'sentCuriousCount',
    );

    // 각 사용자가 받은 "저도 궁금해요" 정보
    const receivedCuriousCountPerUser = await this.postRepository
      .createQueryBuilder('post')
      .select('post.userId', 'userId')
      .addSelect('COUNT(interaction.id)', 'receivedCuriousCount')
      .leftJoin('post.interactions', 'interaction')
      .where('post.spaceId = :spaceId', { spaceId })
      .groupBy('post.userId')
      .getRawMany();

    // 각 사용자가 보낸 "저도 궁금해요" 수의 평균
    const averageReceivedCuriousCountPerUser = this.calculateAverage(
      receivedCuriousCountPerUser,
      'receivedCuriousCount',
    );

    // 본인이 보낸 "저도 궁금해요" 수 (없으면 0)
    const userReceivedCuriousCount = this.findUserInteractionCount(
      receivedCuriousCountPerUser,
      userId,
      'receivedCuriousCount',
    );

    // 각 사용자가 보낸 "좋아요" 정보
    const sentLikeCountGroupByUser = await this.interactionRepository
      .createQueryBuilder('interaction')
      .select('interaction.userId', 'userId')
      .addSelect('COUNT(interaction.id)', 'sentLikeCount')
      .innerJoin('interaction.chat', 'chat')
      .innerJoin('chat.post', 'relatedPost')
      .where('relatedPost.spaceId = :spaceId', { spaceId })
      .groupBy('interaction.userId')
      .getRawMany();

    // 각 사용자가 보낸 "좋아요" 수의 평균
    const averageSentLikeCountPerUser = this.calculateAverage(
      sentLikeCountGroupByUser,
      'sentLikeCount',
    );

    // 본인이 보낸 "좋아요" 수 (없으면 0)
    const userSentLikeCount = this.findUserInteractionCount(
      sentLikeCountGroupByUser,
      userId,
      'sentLikeCount',
    );

    // 각 사용자가 받은 "좋아요" 정보
    const receivedLikeCountGroupByUser = await this.chatRepository
      .createQueryBuilder('chat')
      .select('post.userId', 'userId') // 게시글 작성자 ID를 사용
      .addSelect('COUNT(interaction.id)', 'receivedLikeCount')
      .leftJoin('chat.interactions', 'interaction') // 채팅과 연관된 인터랙션
      .leftJoin('chat.post', 'post') // 채팅이 속한 게시물
      .where('post.spaceId = :spaceId', { spaceId }) // 게시물의 공간 ID로 필터링
      .groupBy('post.userId') // 게시물 작성자 별로 그룹화
      .getRawMany();

    // 각 사용자가 받은 "좋아요" 수의 평균
    const averageReceivedLikeCountPerUser = this.calculateAverage(
      receivedLikeCountGroupByUser,
      'receivedLikeCount',
    );

    // 본인이 받은 "좋아요" 수 (없으면 0)
    const userReceivedLikeCountLikeCount = this.findUserInteractionCount(
      receivedLikeCountGroupByUser,
      userId,
      'receivedLikeCount',
    );

    return {
      averageSentCuriosCountPerUser,
      userSentCuriousCount,
      averageReceivedCuriousCountPerUser,
      userReceivedCuriousCount,
      averageSentLikeCountPerUser,
      userSentLikeCount,
      averageReceivedLikeCountPerUser,
      userReceivedLikeCountLikeCount,
    };
  }

  private calculateAverage(dataArray: any[], countField: string): number {
    const total = dataArray.reduce(
      (acc, cur) => acc + Number(cur[countField]),
      0,
    );
    return dataArray.length > 0 ? Math.round(total / dataArray.length) : 0;
  }

  private findUserInteractionCount(
    dataArray: any[],
    userId: number,
    countField: string,
  ): number {
    const userInfo = dataArray.find((value) => value.userId === userId);
    return Number(userInfo?.[countField] || 0);
  }
}
