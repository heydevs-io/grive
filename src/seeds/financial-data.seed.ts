import { BusinessProfile, FinancialData, User } from '@entities';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { BusinessType } from '../common/enums';

export default class FinancialDataSeed implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const financialDataRepository = dataSource.getRepository(FinancialData);
    const businessTypes = [
      BusinessType.SERVICE,
      BusinessType.CONSTRUCTION,
      BusinessType.RETAIL,
      BusinessType.COSMETIC,
    ];
    const businessProfiles = await dataSource
      .getRepository(BusinessProfile)
      .createQueryBuilder('businessProfile')
      .leftJoin('businessProfile.user', 'user')
      .where('user.email IN (:...emails)', {
        emails: businessTypes.map(
          (type) => `testing_${type.toLowerCase()}@gmail.com`,
        ),
      })
      .getMany();

    if (!businessProfiles || businessProfiles.length === 0) return;

    const financialDataInsert: FinancialData[] = businessProfiles.flatMap(
      (businessProfile) => {
        const startDate = new Date('2023-01-01');
        const endDate = new Date('2025-03-01');

        const monthlyData: FinancialData[] = [];
        for (
          let date = new Date(startDate);
          date <= endDate;
          date.setMonth(date.getMonth() + 1)
        ) {
          monthlyData.push(
            financialDataRepository.create({
              date: new Date(date),
              businessId: businessProfile.id,
            }),
          );
        }
        return monthlyData;
      },
    );

    await financialDataRepository.save(financialDataInsert);
  }
}
