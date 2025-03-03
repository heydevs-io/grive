import { Module } from '@nestjs/common';
import { FinancialDataService } from './financial-data.service';
import { FinancialDataController } from './financial-data.controller';
import { FinancialData } from '@entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessProfileModule } from '../business-profile/business-profile.module';

@Module({
  imports: [TypeOrmModule.forFeature([FinancialData]), BusinessProfileModule],
  controllers: [FinancialDataController],
  providers: [FinancialDataService],
})
export class FinancialDataModule {}
