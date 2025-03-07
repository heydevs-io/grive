import { Expense, FinancialData, RevenueChannel } from '@entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateJS } from '@utils';
import { plainToInstance } from 'class-transformer';
import _ from 'lodash';
import { PolynomialRegression } from 'ml-regression';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CustomBadRequestException } from '../../common/exceptions';
import { MessageResponseDto } from '../auth/dto';
import { BusinessProfileService } from '../business-profile/business-profile.service';
import {
  AnalyzeFinancialDataDto,
  AnalyzeFinancialDataResponseDto,
  FinancialDataOptionsDto,
  FinancialDataResponseDto,
  ImportFinancialDataDto,
  OverallFinancialDataResponseDto,
  RevenueChannelGrowthRateResponseDto,
} from './dto';

@Injectable()
export class FinancialDataService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(FinancialData)
    private readonly financialDataRepository: Repository<FinancialData>,
    private readonly businessProfileService: BusinessProfileService,
  ) {}

  async get(
    userId: string,
    financialDataOptions: FinancialDataOptionsDto,
  ): Promise<FinancialDataResponseDto | null> {
    const businessProfile =
      await this.businessProfileService.getBusinessProfileByUserId(userId);
    if (!businessProfile) {
      return null;
    }
    const query = this.financialDataRepository
      .createQueryBuilder('financialData')
      .where('financialData.businessId = :businessId', {
        businessId: businessProfile.id,
      })
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

    if (result.length === 0) {
      return null;
    }

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
    const businessProfile =
      await this.businessProfileService.getBusinessProfileByUserId(userId);
    if (!businessProfile) {
      return false;
    }
    const result = await this.financialDataRepository.findOne({
      where: {
        businessId: businessProfile.id,
      },
    });

    return !!result;
  }

  async importFinancialData(
    payload: ImportFinancialDataDto,
    userId: string,
  ): Promise<MessageResponseDto> {
    const businessProfile =
      await this.businessProfileService.getBusinessProfileByUserId(userId);
    if (!businessProfile) {
      throw new CustomBadRequestException('Business profile not found');
    }
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
        .where('financialData.businessId = :businessId', {
          businessId: businessProfile.id,
        })
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
              businessId: businessProfile.id,
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

  async getCurrentOverallFinancialData(
    userId: string,
  ): Promise<OverallFinancialDataResponseDto> {
    const businessProfile =
      await this.businessProfileService.getBusinessProfileByUserId(userId);
    if (!businessProfile) {
      throw new CustomBadRequestException('Business profile not found');
    }
    const currentYear = new Date().getFullYear();
    const startYear = new Date(currentYear, 0, 1);
    const endYear = new Date(currentYear, 11, 31);

    const query = this.financialDataRepository
      .createQueryBuilder('financialData')
      .where('financialData.businessId = :businessId', {
        businessId: businessProfile.id,
      })
      .andWhere('financialData.date >= :start', { start: startYear })
      .andWhere('financialData.date <= :end', { end: endYear });

    const result = await query.getMany();

    if (result.length === 0) {
      return {
        overallRevenue: 0,
        overallExpenses: 0,
        predictedRevenue: 0,
        predictedExpenses: 0,
      };
    }

    const overallRevenue = _.sumBy(result, 'totalRevenue');
    const overallExpenses = _.sumBy(result, 'totalExpenses');
    const listTotalRevenue = result.map((item) => item.totalRevenue);
    const listTotalExpenses = result.map((item) => item.totalExpenses);

    const predictedRevenue = this.getPredictedFinancialData(listTotalRevenue);
    const predictedExpenses = this.getPredictedFinancialData(listTotalExpenses);

    return {
      overallRevenue,
      overallExpenses,
      predictedRevenue,
      predictedExpenses,
    };
  }

  private getPredictedFinancialData(listData: number[]): number {
    const sampleMonths = Array.from(
      { length: listData.length },
      (_, index) => index + 1,
    );
    // Degree 2 is the best fit for the data
    const degree = 2;
    // Get index of December in year
    const predictIndex = 12 - listData.length;
    const regression = new PolynomialRegression(sampleMonths, listData, degree);
    return regression.predict(predictIndex);
  }

  async analyzeFinancialData(
    userId: string,
    analyzeOptions: AnalyzeFinancialDataDto,
  ): Promise<AnalyzeFinancialDataResponseDto[]> {
    const { year } = analyzeOptions;
    const businessProfile =
      await this.businessProfileService.getBusinessProfileByUserId(userId);
    if (!businessProfile) {
      throw new CustomBadRequestException('Business profile not found');
    }

    const currentYear = new Date().getFullYear();
    const startYear = new Date(Number(year || currentYear), 0, 1);
    const endYear = new Date(Number(year || currentYear), 11, 31);

    const query = this.financialDataRepository
      .createQueryBuilder('financialData')
      .where('financialData.businessId = :businessId', {
        businessId: businessProfile.id,
      })
      .andWhere('financialData.date >= :start', { start: startYear })
      .andWhere('financialData.date <= :end', { end: endYear })
      .orderBy('financialData.date', 'ASC');

    const result = await query.getMany();

    return plainToInstance(AnalyzeFinancialDataResponseDto, result);
  }

  async getRevenueChannelGrowthRate(
    userId: string,
  ): Promise<RevenueChannelGrowthRateResponseDto[]> {
    const businessProfile =
      await this.businessProfileService.getBusinessProfileByUserId(userId);
    if (!businessProfile) {
      throw new CustomBadRequestException('Business profile not found');
    }

    const query = this.financialDataRepository
      .createQueryBuilder('financialData')
      .where('financialData.businessId = :businessId', {
        businessId: businessProfile.id,
      })
      .leftJoinAndSelect('financialData.revenueChannels', 'revenueChannels')
      .orderBy('financialData.date', 'DESC');

    const result = await query.getMany();

    //Get only 2 latest months data
    const numberOfMonths = 2;
    if (result.length < numberOfMonths) {
      return [];
    }

    const previousData = result[1];
    const currentData = result[0];

    const data = previousData.revenueChannels.map((item, index) => ({
      channel: item.channel,
      growthRate:
        ((currentData.revenueChannels[index].amount -
          previousData.revenueChannels[index].amount) /
          previousData.revenueChannels[index].amount) *
        100,
    }));

    return plainToInstance(RevenueChannelGrowthRateResponseDto, data);
  }
}
