import { DataSource } from 'typeorm';
import { runSeeder, Seeder } from 'typeorm-extension';
import UserSeed from './user.seed';
import FinancialDataSeed from './financial-data.seed';
import RevenueChannelSeed from './revenue-channel.seed';
import ExpenseSeed from './expense.seed';
import BusinessProfileSeed from './business-profile.seed';

export class MainSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    console.log('Running UserSeed');
    await runSeeder(dataSource, UserSeed);
    console.log('Business Profile Seed');
    await runSeeder(dataSource, BusinessProfileSeed);
    console.log('Running FinancialDataSeed');
    await runSeeder(dataSource, FinancialDataSeed);
    console.log('Running RevenueChannelSeed');
    await runSeeder(dataSource, RevenueChannelSeed);
    console.log('Running ExpenseSeed');
    await runSeeder(dataSource, ExpenseSeed);
  }
}
