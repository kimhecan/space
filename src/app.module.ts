import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from 'src/@shared/middlewares/logger.middleware';
import { ChatModel } from 'src/chat/entity/chat.entity';
import { PUBLIC_FOLDER_PATH } from 'src/common/constant/path';
import { InteractionModel } from 'src/interaction/entity/interaction.entity';
import { PostModel } from 'src/post/entity/post.entity';
import { SpaceRoleModel } from 'src/space/entity/space-role.entity';
import { SpaceModel } from 'src/space/entity/space.entity';
import { UserSpaceModel } from 'src/user/entity/user-space.entity';
import { UserModel } from 'src/user/entity/user.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { CommonModule } from './common/common.module';
import { InteractionModule } from './interaction/interaction.module';
import { PostModule } from './post/post.module';
import { SpaceModule } from './space/space.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: PUBLIC_FOLDER_PATH,
      serveRoot: '/public',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        UserModel,
        UserSpaceModel,
        SpaceModel,
        SpaceRoleModel,
        PostModel,
        ChatModel,
        InteractionModel,
      ],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    CommonModule,
    SpaceModule,
    PostModule,
    ChatModule,
    InteractionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    if (process.env.NODE_ENV === 'development') {
      consumer.apply(LoggerMiddleware).forRoutes('*');
    }
  }
}
