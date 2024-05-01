import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModel } from 'src/chat/entity/chat.entity';
import { PostModel } from 'src/post/entity/post.entity';
import { SpaceRoleModel } from 'src/space/entity/space-role.entity';
import { UserSpaceModel } from 'src/user/entity/user-space.entity';
import { UserModel } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { SpaceService } from 'src/space/space.service';
import { SpaceModel } from 'src/space/entity/space.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SpaceModel,
      PostModel,
      ChatModel,
      UserModel,
      UserSpaceModel,
      SpaceRoleModel,
    ]),
  ],
  controllers: [ChatController],
  providers: [SpaceService, ChatService, AuthService, JwtService, UserService],
})
export class ChatModule {}
