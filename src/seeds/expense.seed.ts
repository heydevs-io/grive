import { BusinessProfile, Expense, FinancialData, User } from '@entities';
import { BusinessType, ExpenseType } from '@enums';
import { DataSource, In } from 'typeorm';
import { Seeder } from 'typeorm-extension';

const expenseTitlesByBusinessType: Record<BusinessType, string[]> = {
  [BusinessType.SERVICE]: [
    'Software Subscriptions',
    'Office Rent',
    'Client Entertainment',
    'Marketing & Advertising',
    'Internet & Utilities',
    'Professional Training',
  ],
  [BusinessType.CONSTRUCTION]: [
    'Building Materials',
    'Equipment Rental',
    'Safety Gear',
    'Labor Costs',
    'Site Permits',
    'Vehicle Maintenance',
  ],
  [BusinessType.RETAIL]: [
    'Inventory Purchase',
    'Store Rent',
    'Payment Processing Fees',
    'Packaging & Branding',
    'Staff Salaries',
    'Store Maintenance',
  ],
  [BusinessType.COSMETIC]: [
    'Beauty Products & Supplies',
    'Salon Equipment Maintenance',
    'Hygiene & Sanitation Supplies',
    'Employee Training (New Techniques)',
    'Rent & Utilities',
    'Advertising & Promotions',
  ],
  [BusinessType.OTHER]: [
    'Insurance Fees',
    'Travel Expenses',
    'Tax & Compliance Fees',
    'Loan Repayments',
    'Administrative Supplies',
  ],
};
export default class ExpenseSeed implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const expenseRepository = dataSource.getRepository(Expense);
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

    const expensesToInsert = financialDataRecords.flatMap((financialData) => {
      const businessProfile = businessProfiles.find(
        (bp) => bp.id === financialData.businessId,
      );
      if (!businessProfile) return [];

      const expenseTitles =
        expenseTitlesByBusinessType[
          businessProfile.businessType as BusinessType
        ] || [];

      return expenseTitles.map((title) =>
        expenseRepository.create({
          amount: Math.floor(Math.random() * 5000) + 500,
          title,
          financialDataId: financialData.id,
          type: Math.random() > 0.5 ? ExpenseType.FIXED : ExpenseType.VARIABLE,
          date: financialData.date,
        }),
      );
    });

    await expenseRepository.save(expensesToInsert);
  }
}
