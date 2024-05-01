import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceModel } from 'src/space/entity/space.entity';
import { SpaceRoleModel } from 'src/space/entity/space-role.entity';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { UserModel } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { UserSpaceModel } from 'src/user/entity/user-space.entity';
import { PostModel } from 'src/post/entity/post.entity';
import { ChatModel } from 'src/chat/entity/chat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SpaceModel,
      SpaceRoleModel,
      UserModel,
      UserSpaceModel,
      PostModel,
      ChatModel,
    ]),
  ],
  controllers: [SpaceController],
  providers: [SpaceService, AuthService, JwtService, UserService],
})
export class SpaceModule {}
