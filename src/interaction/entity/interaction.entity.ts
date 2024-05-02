import { Exclude } from 'class-transformer';
import { ChatModel } from 'src/chat/entity/chat.entity';
import { PostModel } from 'src/post/entity/post.entity';

import { UserModel } from 'src/user/entity/user.entity';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('interaction')
export class InteractionModel {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date | null;

  @ManyToOne(() => UserModel, (user) => user.interactions)
  @JoinColumn({ name: 'userId' })
  user: UserModel;

  @ManyToOne(() => PostModel, (post) => post.interactions)
  @JoinColumn({ name: 'postId' })
  post?: PostModel;

  @ManyToOne(() => ChatModel, (chat) => chat.interactions)
  @JoinColumn({ name: 'chatId' })
  chat?: ChatModel;
}
