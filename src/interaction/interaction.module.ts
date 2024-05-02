import { Module } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { InteractionController } from './interaction.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModel } from 'src/chat/entity/chat.entity';
import { InteractionModel } from 'src/interaction/entity/interaction.entity';
import { PostModel } from 'src/post/entity/post.entity';
import { SpaceRoleModel } from 'src/space/entity/space-role.entity';
import { SpaceModel } from 'src/space/entity/space.entity';
import { UserSpaceModel } from 'src/user/entity/user-space.entity';
import { UserModel } from 'src/user/entity/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SpaceModel,
      PostModel,
      ChatModel,
      UserModel,
      UserSpaceModel,
      SpaceRoleModel,
      InteractionModel,
    ]),
  ],
  controllers: [InteractionController],
  providers: [InteractionService, AuthService, JwtService, UserService],
})
export class InteractionModule {}
