import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  ValidateNested,
} from 'class-validator';

export class RevenueChannelDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '5e4ce015-172c-4ecb-a264-9be315de0c12',
  })
  id: string;

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
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '5e4ce015-172c-4ecb-a264-9be315de0c73',
  })
  id: string;

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
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: '5e4ce015-172c-4ecb-a264-9be315de0c72',
  })
  id: string;

  @IsDateString()
  @ApiProperty({
    example: '2024-01',
  })
  date: Date;

  @IsArray()
  @ArrayMaxSize(15)
  @IsOptional()
  @ValidateNested({ each: true })
  @ApiProperty({
    type: [RevenueChannelDto],
  })
  @Type(() => RevenueChannelDto)
  revenueChannels: RevenueChannelDto[];

  @IsOptional()
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
