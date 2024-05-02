import { Exclude } from 'class-transformer';
import { SpaceModel } from 'src/space/entity/space.entity';
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

@Entity('spaceRole')
export class SpaceRoleModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  type: 'admin' | 'participant';

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date | null;

  @ManyToOne(() => SpaceModel, (space) => space.roles)
  @JoinColumn({ name: 'spaceId', referencedColumnName: 'id' })
  space: SpaceModel;
}
