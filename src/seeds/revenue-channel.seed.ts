import {
  BusinessProfile,
  FinancialData,
  RevenueChannel,
  User,
} from '@entities';
import { BusinessType } from '@enums';
import { DataSource, In } from 'typeorm';
import { Seeder } from 'typeorm-extension';

const revenueChannelsByBusinessType: Record<BusinessType, string[]> = {
  [BusinessType.SERVICE]: [
    'Consulting Fees',
    'Software Sales',
    'Subscription Services',
    'Support & Maintenance',
    'Training Programs',
  ],
  [BusinessType.CONSTRUCTION]: [
    'Project Contracts',
    'Equipment Leasing',
    'Construction Material Sales',
    'Subcontracting',
    'Architectural Design Fees',
  ],
  [BusinessType.RETAIL]: [
    'Product Sales',
    'Online Orders',
    'Bulk Discounts',
    'Loyalty Program Revenue',
    'Gift Card Sales',
  ],
  [BusinessType.COSMETIC]: [
    'Beauty Product Sales',
    'Makeup Services',
    'Hair Styling & Treatment',
    'Spa & Wellness Packages',
    'Membership Programs',
  ],
  [BusinessType.OTHER]: [
    'Sponsorships',
    'Advertising Revenue',
    'Event Hosting',
    'Partnership Deals',
    'Investment Returns',
  ],
};
export default class RevenueChannelSeed implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const revenueChannelRepository = dataSource.getRepository(RevenueChannel);
    const businessRepository = dataSource.getRepository(BusinessProfile);
    const financialDataRepository = dataSource.getRepository(FinancialData);

    const businessTypes = [
      BusinessType.SERVICE,
      BusinessType.CONSTRUCTION,
      BusinessType.RETAIL,
      BusinessType.COSMETIC,
    ];

    const businessProfiles = await businessRepository
      .createQueryBuilder('business')
      .leftJoin('business.user', 'user')
      .where('user.email IN (:...emails)', {
        emails: businessTypes.map(
          (type) => `testing_${type.toLowerCase()}@gmail.com`,
        ),
      })
      .getMany();

    if (!businessProfiles || businessProfiles.length === 0) return;

    const financialDataRecords = await financialDataRepository.find({
      where: { businessId: In(businessProfiles.map((bp) => bp.id)) },
    });
    if (!financialDataRecords || financialDataRecords.length === 0) return;

    const revenueChannelsToInsert = financialDataRecords.flatMap(
      (financialData) => {
        const businessProfile = businessProfiles.find(
          (bp) => bp.id === financialData.businessId,
        );
        if (!businessProfile) return [];

        const revenueChannels =
          revenueChannelsByBusinessType[
            businessProfile.businessType as BusinessType
          ] || [];

        return revenueChannels.map((channel) =>
          revenueChannelRepository.create({
            amount: Math.floor(Math.random() * 10000) + 1000,
            channel,
            financialDataId: financialData.id,
            date: financialData.date,
          }),
        );
      },
    );

    if (revenueChannelsToInsert.length) {
      await revenueChannelRepository.save(revenueChannelsToInsert);
    }
  }
}
