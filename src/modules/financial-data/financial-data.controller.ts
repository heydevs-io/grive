import { CurrentUser } from '@decorators';
import { User } from '@entities';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';
import {
  FinancialDataDto,
  ImportFinancialDataDto,
  FinancialDataOptionsDto,
} from './dto';
import { FinancialDataService } from './financial-data.service';

@Controller('financial-data')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class FinancialDataController {
  constructor(private readonly financialDataService: FinancialDataService) {}

  @Post()
  importFinancialData(
    @Body() payload: ImportFinancialDataDto,
    @CurrentUser() user: User,
  ) {
    return this.financialDataService.importFinancialData(
      payload.financialData,
      user.id,
    );
  }

  @Get('own')
  get(
    @CurrentUser() user: User,
    @Query() financialDataOptions: FinancialDataOptionsDto,
  ): Promise<FinancialDataDto[]> {
    return this.financialDataService.get(user.id, financialDataOptions);
  }
}
