import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class FinancialDataOptionsDto {
  @IsDateString()
  @ApiProperty({ example: '2024-01' })
  startDate: Date;

  @IsDateString()
  @ApiProperty({ example: '2024-12' })
  endDate: Date;
}
