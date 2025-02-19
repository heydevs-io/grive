import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsNumber,
  IsString,
  Max,
  ValidateNested,
} from 'class-validator';

export class RevenueChannelDto {
  @IsNumber()
  @ApiProperty({
    example: 10000,
  })
  amount: number;

  @IsString()
  @ApiProperty({
    example: 'Online',
  })
  channel: string;
}

export class ExpenseDto {
  @IsNumber()
  @ApiProperty({
    example: 10000,
  })
  amount: number;

  @IsString()
  @ApiProperty({
    example: 'Salaries',
  })
  title: string;
}

export class FinancialDataDto {
  @IsDateString()
  @ApiProperty({
    example: '2024-01',
  })
  date: Date;

  @IsNumber()
  @ApiProperty({
    example: 10000,
  })
  totalRevenue: number;

  @IsNumber()
  @ApiProperty({
    example: 5000,
  })
  totalExpenses: number;

  @IsNumber()
  @ApiProperty({
    example: 5000,
  })
  totalProfit: number;

  @IsArray()
  @ArrayMaxSize(15)
  @ValidateNested({ each: true })
  @ApiProperty({
    type: [RevenueChannelDto],
  })
  @Type(() => RevenueChannelDto)
  revenueChannels: RevenueChannelDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @ApiProperty({
    type: [ExpenseDto],
  })
  @Type(() => ExpenseDto)
  expenses: ExpenseDto[];
}

export class ImportFinancialDataDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FinancialDataDto)
  @ApiProperty({
    type: [FinancialDataDto],
  })
  financialData: FinancialDataDto[];
}
