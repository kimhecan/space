import { PostModel } from 'src/post/entity/post.entity';
import { UserModel } from 'src/user/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserPostStatusModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lastChecked: Date;

  @ManyToOne(() => UserModel, (user) => user.userPostStatus)
  user: UserModel;

  @ManyToOne(() => PostModel, (post) => post.userPostStatus)
  post: PostModel;
}
