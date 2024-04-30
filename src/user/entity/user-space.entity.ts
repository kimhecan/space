import { SpaceModel } from 'src/space/entity/space.entity';
import { UserModel } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('userSpace')
export class UserSpaceModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 30 })
  roleName: string;

  @ManyToOne(() => UserModel, (user) => user.userSpace)
  @JoinColumn({ name: 'userId' })
  user: UserModel;

  @ManyToOne(() => SpaceModel, (space) => space.userSpace)
  @JoinColumn({ name: 'spaceId' })
  space: SpaceModel;
}
