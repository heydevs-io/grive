import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { RevenueChannel } from './revenue-channel.entity';
import { Expense } from './expense.entity';

@Entity()
@Unique(['userId', 'date'])
export class FinancialData extends BaseEntity {
  @Column()
  userId: string;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User)
  user: User;

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
}
