import { Expense, FinancialData, RevenueChannel } from '@entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateJS } from '@utils';
import { Between, DataSource, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  FinancialDataOptionsDto,
  FinancialDataResponseDto,
  ImportFinancialDataDto,
} from './dto';
import { CustomBadRequestException } from '../../common/exceptions';
import { MessageResponseDto } from '../auth/dto';

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
  ): Promise<FinancialDataResponseDto> {
    const query = this.financialDataRepository
      .createQueryBuilder('financialData')
      .where('financialData.userId = :userId', { userId })
      .leftJoinAndSelect('financialData.revenueChannels', 'revenueChannels')
      .leftJoinAndSelect('financialData.expenses', 'expenses')
      .orderBy('financialData.date', 'ASC')
      .orderBy('revenueChannels.date', 'ASC')
      .orderBy('expenses.date', 'ASC')
      .andWhere('financialData.date >= :startDate', {
        startDate: DateJS.getStartOfDay(financialDataOptions.startDate)
          .startOf('month')
          .toISOString(),
      })
      .andWhere('financialData.date <= :endDate', {
        endDate: DateJS.getEndOfDay(financialDataOptions.endDate)
          .endOf('month')
          .toISOString(),
      });

    const result = await query.getMany();

    console.log(result[0].updatedAt.toISOString());

    const startDate = result[0].date;
    const endDate = result[result.length - 1].date;

    const channels = new Map<string, RevenueChannel[]>();
    const expenses = new Map<string, Expense[]>();

    result.forEach((item) => {
      item.revenueChannels.forEach((channel) => {
        channels.set(channel.channel, [
          ...(channels.get(channel.channel) || []),
          channel,
        ]);
      });
      item.expenses.forEach((expense) => {
        expenses.set(`${expense.title}-${expense.type}`, [
          ...(expenses.get(`${expense.title}-${expense.type}`) || []),
          expense,
        ]);
      });
    });

    return {
      startDate: DateJS.objectDateUTC(startDate, 'YYYY-MM').toISOString(),
      endDate: DateJS.objectDateUTC(endDate, 'YYYY-MM').toISOString(),
      channels: Array.from(channels.values()).map((item) => ({
        channel: item[0].channel,
        values: item.map((item) => item.amount),
      })),
      expenses: Array.from(expenses.values()).map((item) => ({
        title: item[0].title,
        values: item.map((item) => item.amount),
        type: item[0].type,
      })),
    };
  }

  async checkExistFinancialData(userId: string): Promise<boolean> {
    const result = await this.financialDataRepository.findOne({
      where: {
        userId,
      },
    });

    return !!result;
  }

  async importFinancialData(
    payload: ImportFinancialDataDto,
    userId: string,
  ): Promise<MessageResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const financialDataCreated: FinancialData[] = [];
      const createChannel: RevenueChannel[] = [];
      const createExpense: Expense[] = [];

      const startDateFormat = DateJS.getStartOfDay(payload.startDate)
        .startOf('month')
        .toISOString();
      const endDateFormat = DateJS.getStartOfDay(payload.endDate)
        .endOf('month')
        .toISOString();

      const monthLength =
        DateJS.diff(startDateFormat, endDateFormat, 'month') + 1;

      const financialData = await this.financialDataRepository
        .createQueryBuilder('financialData')
        .where('financialData.userId = :userId', { userId })
        .andWhere('financialData.date >= :start', { start: startDateFormat })
        .andWhere('financialData.date <= :end', { end: endDateFormat })
        .getMany();

      const financialDataMap = new Map(
        financialData.map((item) => {
          const dateFormat = DateJS.objectDateUTC(item.date, 'YYYY-MM');
          return [
            `${dateFormat.getFullYear()}-${(dateFormat.getMonth() + 1)
              .toString()
              .padStart(2, '0')}`,
            item,
          ];
        }),
      );

      Array.from({ length: monthLength }, (_, index) => {
        const dateFormat = DateJS.objectDateUTC(
          DateJS.getStartOfDay(payload.startDate)
            .add(index, 'month')
            .startOf('month'),
          'YYYY-MM',
        ).toISOString();

        const financialData = financialDataMap.get(
          DateJS.format(dateFormat, 'YYYY-MM'),
        );

        let id = financialData?.id;
        if (!financialData) {
          id = uuidv4();
          financialDataCreated.push(
            queryRunner.manager.create(FinancialData, {
              date: dateFormat,
              userId,
              id,
            }),
          );
        }
        createChannel.push(
          ...payload.channels.map((channel) => {
            if (channel.values.length !== monthLength)
              throw new CustomBadRequestException(
                `Insufficient channel ${channel.channel} values for the specified number of months`,
              );
            return queryRunner.manager.create(RevenueChannel, {
              amount: channel.values[index],
              channel: channel.channel.trim(),
              financialDataId: id,
              date: dateFormat,
            });
          }),
        );
        createExpense.push(
          ...payload.expenses.map((expense) => {
            if (expense.values.length !== monthLength)
              throw new CustomBadRequestException(
                `Insufficient expense ${expense.title} ${expense.type} values for the specified number of months`,
              );
            return queryRunner.manager.create(Expense, {
              amount: expense.values[index],
              title: expense.title.trim(),
              financialDataId: id,
              type: expense.type,
              date: dateFormat,
            });
          }),
        );
      });
      await queryRunner.manager.save(FinancialData, financialDataCreated);
      await queryRunner.manager.upsert(RevenueChannel, createChannel, {
        conflictPaths: ['date', 'financialDataId', 'channel'],
      });
      await queryRunner.manager.upsert(Expense, createExpense, {
        conflictPaths: ['date', 'financialDataId', 'title'],
      });
      await queryRunner.commitTransaction();
      return {
        message: 'Import financial data successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
