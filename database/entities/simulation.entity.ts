import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Plan } from './plan.entity';
import { Scenario } from './scenario.entity';

@Entity()
export class Simulation extends BaseEntity {
  @Column()
  planId: string;

  @JoinColumn({ name: 'plan_id' })
  @ManyToOne(() => Plan)
  plan: Plan;

  @Column()
  scenarioId: string;

  @JoinColumn({ name: 'scenario_id' })
  @ManyToOne(() => Scenario)
  scenario: Scenario;
}
