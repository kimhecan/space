import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
/**
 * QueryRunnerInterceptor를 사용했다는 가정하에 QueryRunner을 가져오는 데코레이터
 */
export const QueryRunner = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const queryRunner = request.queryRunner;

    if (!queryRunner) {
      throw new InternalServerErrorException('queryRunner not found');
    }

    return queryRunner;
  },
);
