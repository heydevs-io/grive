import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { BusinessProfile } from './business-profile.entity';
import { Expense } from './expense.entity';
import { RevenueChannel } from './revenue-channel.entity';

@Entity()
@Unique(['businessId', 'date'])
export class FinancialData extends BaseEntity {
  @Column({ default: 0 })
  totalRevenue: number;

  @Column({ default: 0 })
  totalExpenses: number;

  @Column({ default: 0 })
  totalProfit: number;

  @Column({ type: 'timestamptz' })
  date: Date;

  @OneToMany(
    () => RevenueChannel,
    (revenueChannel) => revenueChannel.financialData,
  )
  revenueChannels: RevenueChannel[];

  @OneToMany(() => Expense, (expense) => expense.financialData)
  expenses: Expense[];

  @Column({ nullable: true })
  businessId: string;

  @JoinColumn({ name: 'business_id' })
  @ManyToOne(() => BusinessProfile)
  business: BusinessProfile;
}
