import { BaseEntity } from './base.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Milestone } from './milestone.entity';

@Entity()
export class Plan extends BaseEntity {
  @Column('uuid')
  userId: string;

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, (user) => user.plans)
  user: User;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @OneToMany(() => Milestone, (milestone) => milestone.plan)
  milestones: Milestone[];
}
