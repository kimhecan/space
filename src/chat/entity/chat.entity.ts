import { Exclude } from 'class-transformer';
import { PostModel } from 'src/post/entity/post.entity';
import { UserModel } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('chat')
export class ChatModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column({ default: false })
  anonymous: boolean;

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date | null;

  @ManyToOne(() => UserModel, (user) => user.chats)
  @JoinColumn({ name: 'userId' })
  user: UserModel;

  @ManyToOne(() => PostModel, (post) => post.chats, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: PostModel;

  @ManyToOne(() => ChatModel, (chat) => chat.replies, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: ChatModel | null;

  @OneToMany(() => ChatModel, (chat) => chat.parent)
  replies: ChatModel[];
}
