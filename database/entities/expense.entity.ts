import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { FinancialData } from './financial-data.entity';
import { BaseEntity } from './base.entity';
import { ExpenseType } from '../../src/common/enums/expense.enum';

@Entity()
@Unique(['date', 'financialDataId', 'title'])
export class Expense extends BaseEntity {
  @Column()
  amount: number;

  @Column()
  title: string;

  @Column('uuid')
  financialDataId: string;

  @JoinColumn({ name: 'financial_data_id' })
  @ManyToOne(() => FinancialData, (financialData) => financialData.expenses)
  financialData: FinancialData;

  @Column({ type: 'enum', enum: ExpenseType, default: ExpenseType.VARIABLE })
  type: ExpenseType;

  @Column({ type: 'timestamptz' })
  date: Date;
}
