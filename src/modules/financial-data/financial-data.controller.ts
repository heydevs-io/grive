import { CurrentUser } from '@decorators';
import { User } from '@entities';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';
import {
  FinancialDataResponseDto,
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
    return this.financialDataService.importFinancialData(payload, user.id);
  }

  @Get('own')
  getOwnFinancialData(
    @CurrentUser() user: User,
    @Query() financialDataOptions: FinancialDataOptionsDto,
  ) {
    return this.financialDataService.get(user.id, financialDataOptions);
  }

  @Get('check-exist')
  checkExistFinancialData(@CurrentUser() user: User) {
    return this.financialDataService.checkExistFinancialData(user.id);
  }
}
