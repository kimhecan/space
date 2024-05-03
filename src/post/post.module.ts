import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModel } from 'src/post/entity/post.entity';
import { ChatModel } from 'src/chat/entity/chat.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { UserModel } from 'src/user/entity/user.entity';
import { UserSpaceModel } from 'src/user/entity/user-space.entity';
import { SpaceRoleModel } from 'src/space/entity/space-role.entity';
import { SpaceModel } from 'src/space/entity/space.entity';
import { SpaceService } from 'src/space/space.service';
import { UserPostStatusModel } from 'src/user/entity/user-post-status.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SpaceModel,
      PostModel,
      ChatModel,
      UserModel,
      UserSpaceModel,
      SpaceRoleModel,
      UserPostStatusModel,
    ]),
  ],
  controllers: [PostController],
  providers: [SpaceService, PostService, AuthService, JwtService, UserService],
})
export class PostModule {}
