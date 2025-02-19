import { Expense, FinancialData, RevenueChannel } from '@entities';
import { Injectable } from '@nestjs/common';
import { DataSource, Equal, In, InsertResult, Repository } from 'typeorm';
import {
  ExpenseDto,
  FinancialDataDto,
  RevenueChannelDto,
} from './dto/financial-data.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PageDto, PageMetaDto, PageOptionsDto } from '@dtos';
import { v4 as uuidv4 } from 'uuid';
import { FinancialDataOptionsDto } from './dto';
import { DateJS } from '../../common/utils';

@Injectable()
export class FinancialDataService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(FinancialData)
    private readonly financialDataRepository: Repository<FinancialData>,
  ) {}

  async get(
    userId: string,
    financialDataOptions: FinancialDataOptionsDto,
  ): Promise<FinancialDataDto[]> {
    const query = this.financialDataRepository
      .createQueryBuilder('financialData')
      .where('financialData.userId = :userId', { userId })
      .andWhere('financialData.date >= :fromYear', {
        fromYear: financialDataOptions.fromYear
          ? new Date(financialDataOptions.fromYear, 0, 1)
          : undefined,
      })
      .andWhere('financialData.date <= :toYear', {
        toYear: financialDataOptions.toYear
          ? new Date(financialDataOptions.toYear, 12, 31)
          : undefined,
      })
      .leftJoinAndSelect('financialData.revenueChannels', 'revenueChannels')
      .leftJoinAndSelect('financialData.expenses', 'expenses')
      .orderBy('financialData.date', 'ASC');

    const result = await query.getMany();

    return result;
  }

  async importFinancialData(payload: FinancialDataDto[], userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const revenues: Promise<RevenueChannelDto>[] = [];
      const expenses: Promise<ExpenseDto>[] = [];
      const financialDataCreated: Promise<FinancialDataDto>[] = [];
      for (const financialData of payload) {
        const dateFormat = new Date(
          DateJS.getStartOfDay(financialData.date).utc(false).toISOString(),
        );

        let data = await this.financialDataRepository
          .createQueryBuilder('financialData')
          .where('financialData.userId = :userId', { userId })
          .andWhere('financialData.id = :id', { id: financialData.id })
          .orWhere('financialData.date = :date', {
            date: dateFormat,
          })
          .getOne();
        let id = data?.id;
        if (!data) {
          id = uuidv4();
          financialDataCreated.push(
            queryRunner.manager.save(FinancialData, {
              ...financialData,
              userId,
              id,
            }),
          );
        }
        revenues.push(
          ...financialData.revenueChannels?.map((revenue) =>
            queryRunner.manager.save(RevenueChannel, {
              ...revenue,
              financialDataId: id,
            }),
          ),
        );
        expenses.push(
          ...financialData.expenses?.map((expense) =>
            queryRunner.manager.save(Expense, {
              ...expense,
              financialDataId: id,
            }),
          ),
        );
      }
      await Promise.all([...financialDataCreated, ...revenues, ...expenses]);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
