import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'src/@shared/decorator/user.decorator';
import { AccessTokenGuard } from 'src/auth/guard/bearer-token.guard';
import { CreateSpaceDto } from './dto/create-space.dto';
import { SpaceService } from './space.service';
import { TransactionInterceptor } from 'src/@shared/interceptor/transaction-interceptor';
import { QueryRunner } from 'src/@shared/decorator/query-runner.decorator';
import { QueryRunner as QR } from 'typeorm';
import { CreateSpaceRoleDto } from 'src/space/dto/space-role-dto';

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransactionInterceptor)
  create(
    @User() user,
    @Body() createSpace: CreateSpaceDto,
    @QueryRunner() queryRunner: QR,
  ) {
    return this.spaceService.create({ user, createSpace, queryRunner });
  }

  @Get('my-space')
  @UseGuards(AccessTokenGuard)
  async getMySpaces(@User() user) {
    return this.spaceService.getSpacesByUserId(user.id);
  }

  @Get(':id')
  @UseGuards(AccessTokenGuard)
  async getSpace(@Param('id', ParseIntPipe) id: number) {
    return this.spaceService.getSpaceId(id);
  }

  @Patch(':spaceId/owner/:newOwnerId')
  @UseGuards(AccessTokenGuard)
  async appointNewOwner(
    @User() user,
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Param('newOwnerId', ParseIntPipe) newOwnerId: number,
  ) {
    // 현재 사용자가 소유자인지 확인
    const isOwner = await this.spaceService.isUserOwner(user.id, spaceId);

    if (!isOwner) {
      throw new ForbiddenException('공간 소유자만 변경할 수 있습니다.');
    }

    // 새로운 소유자로 변경
    await this.spaceService.appointNewOwner({
      ownerId: user.id,
      newOwnerId: newOwnerId,
      spaceId: spaceId,
    });

    return { message: '성공적으로 새로운 소유자를 임명했습니다.' };
  }

  @Post(':spaceId/join')
  @UseGuards(AccessTokenGuard)
  async joinSpace(
    @User() user,
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Body('code') code: string,
    @Body('role') role: CreateSpaceRoleDto,
  ) {
    // 공간에 참여하기
    await this.spaceService.joinSpace({ user, spaceId, code, role });
    return { message: 'Joined space successfully.' };
  }

  @Delete(':spaceId')
  @UseGuards(AccessTokenGuard)
  async deleteSpace(
    @User() user,
    @Param('spaceId', ParseIntPipe) spaceId: number,
  ) {
    // 공간 삭제
    await this.spaceService.deleteSpace(user, spaceId);
    return { message: '성공적으로 삭제되었습니다.' };
  }

  @Patch(':spaceId/user/:userId/role')
  @UseGuards(AccessTokenGuard)
  async changeUserRole(
    @User() user,
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body('role') role: string,
  ) {
    const canChangeRole = await this.spaceService.isUserOwner(user.id, spaceId);

    if (!canChangeRole) {
      throw new ForbiddenException('역할을 변경할 수 있는 권한이 없습니다.');
    }

    // 사용자 역할 변경
    await this.spaceService.changeUserRole({ userId, spaceId, newRole: role });

    return { message: '사용자 역할이 성공적으로 변경되었습니다.' };
  }

  @Delete(':spaceId/role')
  @UseGuards(AccessTokenGuard)
  async deleteUserRole(
    @User() user,
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Body('role') role: string,
  ) {
    const canDeleteRole = await this.spaceService.isUserOwner(user.id, spaceId);

    if (!canDeleteRole) {
      throw new ForbiddenException('역할을 삭제할 수 있는 권한이 없습니다.');
    }

    await this.spaceService.deleteUserRole({ userId: user.id, spaceId, role });

    return { message: '사용자 역할이 성공적으로 삭제되었습니다.' };
  }
}
