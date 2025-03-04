import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class FinancialDataOptionsDto {
  @IsDateString()
  @ApiProperty({ example: '2024-01' })
  startDate: Date;

  @IsDateString()
  @ApiProperty({ example: '2024-12' })
  endDate: Date;
}

export class AnalyzeFinancialDataDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: '2024' })
  year?: string;
}
