import { Exclude } from 'class-transformer';
import { SpaceModel } from 'src/space/entity/space.entity';
import { UserModel } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('userSpace')
export class UserSpaceModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 30 })
  roleName: string;

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date | null;

  @ManyToOne(() => UserModel, (user) => user.userSpace)
  @JoinColumn({ name: 'userId' })
  user: UserModel;

  @ManyToOne(() => SpaceModel, (space) => space.userSpace)
  @JoinColumn({ name: 'spaceId' })
  space: SpaceModel;
}
