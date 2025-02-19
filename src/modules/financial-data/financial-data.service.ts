import { Expense, FinancialData, RevenueChannel } from '@entities';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import {
  ExpenseDto,
  FinancialDataDto,
  RevenueChannelDto,
} from './dto/financial-data.dto';

@Injectable()
export class FinancialDataService {
  constructor(private readonly dataSource: DataSource) {}

  async importFinancialData(payload: FinancialDataDto[], userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const revenues: RevenueChannelDto[] = [];
      const expenses: ExpenseDto[] = [];
      const financialDataCreated = payload.map((financialData) => {
        const data = queryRunner.manager.create(FinancialData, {
          ...financialData,
          userId,
        });
        revenues.push(
          ...financialData.revenueChannels.map((revenue) =>
            queryRunner.manager.create(RevenueChannel, revenue),
          ),
        );
        expenses.push(
          ...financialData.expenses.map((expense) =>
            queryRunner.manager.create(Expense, expense),
          ),
        );
        return data;
      });
      await queryRunner.manager.save(FinancialData, financialDataCreated);
      await queryRunner.manager.save(RevenueChannel, revenues);
      await queryRunner.manager.save(Expense, expenses);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
