import { CurrentUser, CustomApiResponse } from '@decorators';
import { User } from '@entities';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';
import {
  FinancialDataResponseDto,
  ImportFinancialDataDto,
  FinancialDataOptionsDto,
  OverallFinancialDataResponseDto,
  AnalyzeFinancialDataDto,
  AnalyzeFinancialDataResponseDto,
  RevenueChannelGrowthRateResponseDto,
} from './dto';
import { FinancialDataService } from './financial-data.service';
import { MessageResponseDto } from '../auth/dto';

@Controller('financial-data')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class FinancialDataController {
  constructor(private readonly financialDataService: FinancialDataService) { }

  @Post()
  @CustomApiResponse(MessageResponseDto)
  importFinancialData(
    @Body() payload: ImportFinancialDataDto,
    @CurrentUser() user: User,
  ): Promise<MessageResponseDto> {
    return this.financialDataService.importFinancialData(payload, user.id);
  }

  @Get('own')
  @CustomApiResponse(FinancialDataResponseDto)
  getOwnFinancialData(
    @CurrentUser() user: User,
    @Query() financialDataOptions: FinancialDataOptionsDto,
  ) {
    return this.financialDataService.get(user.id, financialDataOptions);
  }

  @Get('check-exist')
  @CustomApiResponse(Boolean)
  checkExistFinancialData(@CurrentUser() user: User) {
    return this.financialDataService.checkExistFinancialData(user.id);
  }

  @Get('overall')
  @CustomApiResponse(OverallFinancialDataResponseDto)
  getOverallFinancialData(@CurrentUser() user: User) {
    return this.financialDataService.getCurrentOverallFinancialData(user.id);
  }

  @Get('analyze')
  @CustomApiResponse(AnalyzeFinancialDataResponseDto)
  analyzeFinancialData(
    @CurrentUser() user: User,
    @Query() analyzeOptions: AnalyzeFinancialDataDto,
  ): Promise<AnalyzeFinancialDataResponseDto[]> {
    return this.financialDataService.analyzeFinancialData(
      user.id,
      analyzeOptions,
    );
  }
  @Get('revenue-channel/growth-rate')
  @CustomApiResponse(RevenueChannelGrowthRateResponseDto)
  getRevenueChannelGrowthRate(@CurrentUser() user: User) {
    return this.financialDataService.getRevenueChannelGrowthRate(user.id);
  }
}
