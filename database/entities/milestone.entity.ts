import { BaseEntity } from './base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Plan } from './plan.entity';
import { MilestoneType } from '@enums';

@Entity()
export class Milestone extends BaseEntity {
  @Column('uuid')
  planId: string;

  @JoinColumn({ name: 'planId' })
  @ManyToOne(() => Plan, (plan) => plan.milestones)
  plan: Plan;

  @Column({ type: 'enum', enum: MilestoneType })
  type: MilestoneType;

  @Column({ type: 'timestamp' })
  expectedDate: Date;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  target_value: number;
}
