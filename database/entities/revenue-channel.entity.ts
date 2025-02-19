import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { FinancialData } from './financial-data.entity';
import { BaseEntity } from './base.entity';
@Entity()
export class RevenueChannel extends BaseEntity {
  @Column()
  amount: number;

  @Column()
  channel: string;

  @Column()
  financialDataId: string;

  @JoinColumn({ name: 'financial_data_id' })
  @ManyToOne(
    () => FinancialData,
    (financialData) => financialData.revenueChannels,
  )
  financialData: FinancialData;
}
