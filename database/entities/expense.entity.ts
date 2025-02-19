import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { FinancialData } from './financial-data.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class Expense extends BaseEntity {
  @Column()
  amount: number;

  @Column()
  title: string;

  @Column()
  financialDataId: string;

  @JoinColumn({ name: 'financial_data_id' })
  @ManyToOne(() => FinancialData, (financialData) => financialData.expenses)
  financialData: FinancialData;
}
