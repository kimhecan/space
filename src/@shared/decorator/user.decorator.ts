import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserModel } from 'src/user/entity/user.entity';
/**
 * AccessTokenGuard를 사용했다는 가정하에 사용자 정보를 가져오는 데코레이터
 */
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const user = request.user;

    if (!user) {
      throw new InternalServerErrorException('User not found');
    }

    return user as UserModel;
  },
);
