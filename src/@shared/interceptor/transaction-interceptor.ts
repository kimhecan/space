import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();

    // 포스트와 이미지 저장을 하나의 트랜잭션으로 묶어줍니다.
    await queryRunner.startTransaction();

    // queryRunner을 request에 저장합니다.
    request.queryRunner = queryRunner;

    return next.handle().pipe(
      catchError(async (error) => {
        console.log(error, 'error');
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        throw new InternalServerErrorException(error, 'Transaction failed');
      }),
      tap(async () => {
        await queryRunner.commitTransaction();
        await queryRunner.release();
      }),
    );
  }
}
