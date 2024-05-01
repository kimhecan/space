import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { generateUniqueString } from 'src/@shared/utils/generate-unique-string';
import { ChatModel } from 'src/chat/entity/chat.entity';
import { PostModel } from 'src/post/entity/post.entity';
import { CreateSpaceDto } from 'src/space/dto/create-space.dto';
import { CreateSpaceRoleDto } from 'src/space/dto/space-role-dto';
import { SpaceRoleModel } from 'src/space/entity/space-role.entity';
import { SpaceModel } from 'src/space/entity/space.entity';
import { UserSpaceModel } from 'src/user/entity/user-space.entity';
import { UserModel } from 'src/user/entity/user.entity';
import { QueryRunner, Repository } from 'typeorm';

@Injectable()
export class SpaceService {
  constructor(
    @InjectRepository(UserSpaceModel)
    private userSpaceRepository: Repository<UserSpaceModel>,
    @InjectRepository(SpaceModel)
    private spaceRepository: Repository<SpaceModel>,
    @InjectRepository(SpaceRoleModel)
    private spaceRoleRepository: Repository<SpaceRoleModel>,
    @InjectRepository(PostModel)
    private postRepository: Repository<PostModel>,
    @InjectRepository(ChatModel)
    private chatRepository: Repository<ChatModel>,
  ) {}

  async create({
    user,
    createSpace,
    queryRunner,
  }: {
    user: UserModel;
    createSpace: CreateSpaceDto;
    queryRunner: QueryRunner;
  }) {
    const spaceDto = {
      name: createSpace.name,
      logo: createSpace.logo,
      // 공간을 개설할 경우, 유저는 소유자로 공간에 참여합니다.
      ownerId: user.id,
      adminCode: generateUniqueString(8),
      participantCode: generateUniqueString(8),
    };

    const space = await queryRunner.manager
      .getRepository<SpaceModel>(SpaceModel)
      .save(spaceDto);

    const userSpace = {
      user: {
        id: user.id,
      },
      space: {
        id: space.id,
      },
      roleName: createSpace.myRole.name,
    };

    await Promise.all([
      ...createSpace.roles.map((role) => {
        const roleDto = {
          name: role.name,
          type: role.type,
          space: {
            id: space.id,
          },
        };
        return queryRunner.manager
          .getRepository<SpaceRoleModel>(SpaceRoleModel)
          .save(roleDto);
      }),
      queryRunner.manager
        .getRepository<UserSpaceModel>(UserSpaceModel)
        .save(userSpace),
    ]);

    return space.id;
  }

  async getSpacesByUserId(userId: number) {
    const userSpaces = await this.userSpaceRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['space', 'space.roles'],
    });

    return userSpaces.map((userSpace) => ({
      ...userSpace.space,
      myRole: userSpace.roleName,
    }));
  }

  async getSpaceId(id: number) {
    const space = await this.spaceRepository.findOne({
      where: {
        id,
      },
      relations: ['roles'],
    });

    return space;
  }

  async isUserOwner(userId: number, spaceId: number) {
    const userSpace = await this.spaceRepository.existsBy({
      id: spaceId,
      ownerId: userId,
    });

    if (!userSpace) {
      return false;
    }
    return true;
  }

  async appointNewOwner({
    ownerId,
    newOwnerId,
    spaceId,
  }: {
    ownerId;
    newOwnerId: number;
    spaceId: number;
  }) {
    const userSpace = await this.spaceRepository.findOne({
      where: {
        id: spaceId,
        ownerId: ownerId,
      },
    });

    if (!userSpace) {
      throw new ForbiddenException('이 공간의 소유자만 변경할 수 있습니다.');
    }

    await this.spaceRepository.update({ id: spaceId }, { ownerId: newOwnerId });
  }

  async joinSpace({
    user,
    spaceId,
    code,
    role,
  }: {
    user: UserModel;
    spaceId: number;
    code: string;
    role: CreateSpaceRoleDto;
  }) {
    const space = await this.spaceRepository.findOne({
      where: { id: spaceId },
      select: ['id', 'adminCode', 'participantCode'], // Only fetch necessary fields
    });

    if (!space) {
      throw new NotFoundException('공간을 찾을 수 없습니다.');
    }

    // 이미 참여한 공간인지 확인
    const isAlreadyJoined = await this.userSpaceRepository.existsBy({
      user: { id: user.id },
      space: {
        id: spaceId,
      },
    });

    if (isAlreadyJoined) {
      throw new ForbiddenException('이미 참여한 공간입니다.');
    }

    const spaceRoles = await this.spaceRoleRepository.find({
      where: {
        space: {
          id: spaceId,
        },
      },
    });

    if (space.adminCode === code || space.participantCode === code) {
      const spaceRole = spaceRoles.find(
        (spaceRole) =>
          spaceRole.type === role.type || spaceRole.name === role.name,
      );

      if (!spaceRole) {
        throw new NotFoundException(
          '코드에 맞는 공간의 역할을 찾을 수 없습니다.',
        );
      }

      const userSpace = {
        user: {
          id: user.id,
        },
        space: {
          id: spaceId,
        },
        roleName: role.name,
      };

      return await this.userSpaceRepository.save(userSpace);
    }

    throw new NotFoundException('잘못된 코드입니다.');
  }

  async deleteSpace(user: UserModel, spaceId: number) {
    const isOwner = await this.isUserOwner(user.id, spaceId);

    if (!isOwner) {
      throw new ForbiddenException('공간 소유자만 삭제할 수 있습니다.');
    }

    // 공간삭제시 관련된 데이터 모두 softDelete
    await Promise.all([
      this.userSpaceRepository.softDelete({
        space: {
          id: spaceId,
        },
      }),
      this.spaceRoleRepository.softDelete({
        space: {
          id: spaceId,
        },
      }),
      this.postRepository.softDelete({
        space: {
          id: spaceId,
        },
      }),
      this.chatRepository
        .createQueryBuilder('chat')
        .innerJoin('chat.post', 'post')
        .innerJoin('post.space', 'space', 'space.id = :spaceId', { spaceId })
        .softDelete()
        .execute(),
      this.spaceRepository.softDelete({ id: spaceId }),
    ]);

    return {
      message: '정상적으로 삭제되었습니다.',
    };
  }

  async changeUserRole({
    userId,
    spaceId,
    newRole,
  }: {
    userId: number;
    spaceId: number;
    newRole: string;
  }) {
    await this.userSpaceRepository.update(
      {
        user: {
          id: userId,
        },
        space: {
          id: spaceId,
        },
      },
      {
        roleName: newRole,
      },
    );
  }
  async deleteUserRole({
    userId,
    spaceId,
    role,
  }: {
    userId: number;
    spaceId: number;
    role: string;
  }) {
    const isRoleInUse = await this.userSpaceRepository.count({
      where: { roleName: role },
    });

    if (isRoleInUse > 0) {
      throw new BadRequestException(
        '역할이 현재 사용 중이므로 삭제할 수 없습니다.',
      );
    }

    await this.userSpaceRepository.softDelete({
      user: {
        id: userId,
      },
      space: {
        id: spaceId,
      },
      roleName: role,
    });
  }
}
