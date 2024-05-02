import { Exclude } from 'class-transformer';
import { ChatModel } from 'src/chat/entity/chat.entity';
import { PostType } from 'src/post/type';
import { InteractionModel } from 'src/interaction/entity/interaction.entity';
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

  @Column('boolean', { nullable: true })
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

  // 관계 정의
  @ManyToOne(() => UserModel, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  user: UserModel;

  @ManyToOne(() => SpaceModel, (space) => space.posts)
  @JoinColumn({ name: 'spaceId' })
  space: SpaceModel;

  @OneToMany(() => ChatModel, (chat) => chat.post)
  chats: ChatModel[];

  @OneToMany(() => InteractionModel, (interaction) => interaction.post)
  interactions: InteractionModel[];
}
