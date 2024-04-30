import { Exclude } from 'class-transformer';
import { SpaceRoleModel } from 'src/space/entity/space-role.entity';
import { UserSpaceModel } from 'src/user/entity/user-space.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('space')
export class SpaceModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  logo: string;

  @Column()
  ownerId: number;

  @Column()
  adminCode: string;

  @Column()
  participantCode: string;

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
  @OneToMany(() => UserSpaceModel, (userSpace) => userSpace.space)
  userSpace: UserSpaceModel[];

  @OneToMany(() => SpaceRoleModel, (role) => role.space)
  roles: SpaceRoleModel[];
}
