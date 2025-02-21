import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { FinancialData } from './financial-data.entity';
import { BaseEntity } from './base.entity';
@Entity()
@Unique(['date', 'financialDataId', 'channel'])
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

  @Column({ type: 'timestamptz' })
  date: Date;
}
