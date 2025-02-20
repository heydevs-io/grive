import { ExpenseType } from '@enums';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsString,
  ValidateNested
} from 'class-validator';

export class CreateRevenueChannelDto {
  @IsNumber({}, { each: true })
  @ApiProperty({
    example: [10000, 20000, 30000, 40000],
  })
  values: number[];

  @IsString()
  @ApiProperty({
    example: 'Online',
  })
  channel: string;
}

@Exclude()
export class RevenueChannelResponseDto {
  @Expose()
  @ApiProperty({
    example: 'Online',
  })
  channel: string;

  @Expose()
  @ApiProperty({
    example: [10000, 20000, 30000, 40000],
  })
  values: number[];
}

export class CreateExpenseDto {
  @IsNumber({}, { each: true })
  @ApiProperty({
    example: [10000, 20000, 30000, 40000],
  })
  values: number[];

  @IsString()
  @ApiProperty({
    example: 'Salaries',
  })
  title: string;

  @IsEnum(ExpenseType)
  @ApiProperty({
    example: ExpenseType.FIXED,
    enum: ExpenseType,
  })
  type: ExpenseType;
}

@Exclude()
export class ExpenseResponseDto {
  @Expose()
  @ApiProperty({
    example: 'Salaries',
  })
  title: string;

  @Expose()
  @ApiProperty({
    example: [10000, 20000, 30000, 40000],
  })
  values: number[];

  @Expose()
  @ApiProperty({
    example: ExpenseType.FIXED,
    enum: ExpenseType,
  })
  type: ExpenseType;
}

@Exclude()
export class FinancialDataResponseDto {
  @Expose()
  @ApiProperty({
    example: '2024-01',
  })
  startDate: string;

  @Expose()
  @ApiProperty({
    example: '2024-12',
  })
  endDate: string;

  @Expose()
  @ApiProperty({
    type: [RevenueChannelResponseDto],
  })
  channels: RevenueChannelResponseDto[];

  @Expose()
  @ApiProperty({
    type: [ExpenseResponseDto],
  })
  expenses: ExpenseResponseDto[];
}

export class ImportFinancialDataDto {
  @IsDateString()
  @ApiProperty({
    example: '2024-01',
  })
  startDate: Date;

  @IsDateString()
  @ApiProperty({
    example: '2024-12',
  })
  endDate: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRevenueChannelDto)
  @ApiProperty({
    type: [CreateRevenueChannelDto],
  })
  channels: CreateRevenueChannelDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExpenseDto)
  @ApiProperty({
    type: [CreateExpenseDto],
  })
  expenses: CreateExpenseDto[];
}
