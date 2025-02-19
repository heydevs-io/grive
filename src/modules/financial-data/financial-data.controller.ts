import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { FinancialDataService } from './financial-data.service';
import { ImportFinancialDataDto } from './dto/financial-data.dto';
import { CurrentUser } from '@decorators';
import { User } from '@entities';
import { JwtAuthGuard } from '../auth/guards';
import { ApiBearerAuth } from '@nestjs/swagger';

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
}
