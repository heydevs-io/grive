import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { RevenueChannel } from './revenue-channel.entity';
import { Expense } from './expense.entity';

@Entity()
export class FinancialData extends BaseEntity {
  @Column()
  userId: string;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User)
  user: User;

  @Column()
  totalRevenue: number;

  @Column()
  totalExpenses: number;

  @Column()
  totalProfit: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @OneToMany(
    () => RevenueChannel,
    (revenueChannel) => revenueChannel.financialData,
  )
  revenueChannels: RevenueChannel[];

  @OneToMany(() => Expense, (expense) => expense.financialData)
  expenses: Expense[];
}
