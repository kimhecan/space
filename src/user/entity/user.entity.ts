import { Exclude, Transform } from 'class-transformer';
import { join } from 'path';
import { ChatModel } from 'src/chat/entity/chat.entity';
import { USER_PUBLIC_IMAGE_PATH } from 'src/common/constant/path';
import { PostModel } from 'src/post/entity/post.entity';
import { UserSpaceModel } from 'src/user/entity/user-space.entity';
import { Gender } from 'src/user/type';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('user')
export class UserModel {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { unique: true, length: 30 })
  email: string;

  @Column('varchar', { unique: true, length: 60, select: false })
  @Exclude()
  password: string;

  @Column('varchar', { length: 50 })
  name: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.Male,
  })
  gender: Gender;

  @Column('varchar', { length: 255, nullable: true })
  @Transform(({ value }) => value && `/${join(USER_PUBLIC_IMAGE_PATH, value)}`)
  profileImage: string;

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date | null;

  // 관계정의
  @OneToMany(() => UserSpaceModel, (userSpace) => userSpace.user)
  userSpace: UserSpaceModel[];

  @OneToMany(() => PostModel, (post) => post.user)
  posts: PostModel[];

  @OneToMany(() => ChatModel, (chat) => chat.user)
  chats: ChatModel[];
}
