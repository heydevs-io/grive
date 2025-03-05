import { BusinessProfile, User } from '@entities';
import { BusinessFocus, BusinessType } from '@enums';
import { DataSource, In } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import sicCodes from '../common/constants/sic-codes.json';

export default class BusinessProfileSeed implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const businessTypes = [
      BusinessType.SERVICE,
      BusinessType.CONSTRUCTION,
      BusinessType.RETAIL,
      BusinessType.COSMETIC,
    ];

    const users = await dataSource.getRepository(User).find({
      where: {
        email: In(
          businessTypes.map(
            (type) => `testing_${type.toLowerCase()}@gmail.com`,
          ),
        ),
      },
    });

    if (!users || users.length === 0) return;

    const sicCodeMap = {
      [BusinessType.SERVICE]: '700',
      [BusinessType.CONSTRUCTION]: '1520',
      [BusinessType.RETAIL]: '5200',
      [BusinessType.COSMETIC]: '2844',
    };

    const specificServiceMap = {
      [BusinessType.SERVICE]: 'Consulting Services',
      [BusinessType.CONSTRUCTION]: 'Building Construction',
      [BusinessType.RETAIL]: 'Retail Management',
      [BusinessType.COSMETIC]: 'Beauty and Personal Care',
    };

    const businessProfileRepository = dataSource.getRepository(BusinessProfile);
    const businessProfiles = businessTypes.map((businessType) => {
      const user = users.find(
        (user) =>
          user.email === `testing_${businessType.toLowerCase()}@gmail.com`,
      );
      if (!user) return null;

      const data = businessProfileRepository.create({
        userId: user.id,
        name: `Company ${businessType}`,
        foundedDate: new Date(2023, 1, 1),
        businessType: businessType,
        industryTitle: sicCodes[businessType][sicCodeMap[businessType]],
        industrySIC: sicCodeMap[businessType],
        specificService: specificServiceMap[businessType],
        focus: [
          BusinessFocus.BUSINESS_GROWTH_HEALTH,
          BusinessFocus.FINANCIAL_CASH,
          BusinessFocus.FORECASTING_PLANNING,
          BusinessFocus.METRICS_INSIGHTS,
          BusinessFocus.PRODUCT_MARKET_FIT,
        ],
        onboardingComplete: true,
      });

      return data;
    });

    await businessProfileRepository.save(
      businessProfiles.filter((data) => data !== null),
    );
  }
}
