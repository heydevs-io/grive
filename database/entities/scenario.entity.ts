import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ScenarioType } from '@enums';
import { BaseEntity } from './base.entity';
import { Plan } from './plan.entity';

@Entity()
export class Scenario extends BaseEntity {
  @Column()
  planId: string;

  @JoinColumn({ name: 'plan_id' })
  @ManyToOne(() => Plan)
  plan: Plan;

  @Column({ type: 'enum', enum: ScenarioType })
  type: ScenarioType;

  @Column()
  monthlyTakeHome: number;

  @Column()
  projectRevenue: number;

  @Column()
  recommendedCashReserve: number;

  @Column()
  recommendedMonthlyInvestment: number;
}
