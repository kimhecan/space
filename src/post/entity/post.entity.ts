import { Exclude } from 'class-transformer';
import { ChatModel } from 'src/chat/entity/chat.entity';
import { SpaceModel } from 'src/space/entity/space.entity';
import { UserModel } from 'src/user/entity/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum PostType {
  Notice = '공지',
  Question = '질문',
}

@Entity('post')
export class PostModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({
    type: 'enum',
    enum: PostType,
    default: PostType.Question,
  })
  type: PostType;

  @Column({ nullable: true })
  anonymous: boolean;

  @Column({ nullable: true })
  attachmentUrl: string;

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date | null;

  @ManyToOne(() => UserModel, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  user: UserModel;

  @ManyToOne(() => SpaceModel, (space) => space.posts)
  @JoinColumn({ name: 'spaceId' })
  space: SpaceModel;

  @OneToMany(() => ChatModel, (chat) => chat.post)
  chats: ChatModel[];
}
