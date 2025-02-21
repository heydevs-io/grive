import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ExpenseType } from '@enums';

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
export class RevenueChannelDto {
  @Expose()
  @ApiProperty({
    example: 10000,
  })
  amount: number;

  @Expose()
  @ApiProperty({
    example: 'Online',
  })
  channel: string;

  @Expose()
  @ApiProperty({
    example: '5e4ce015-172c-4ecb-a264-9be315de0c72',
  })
  id: string;
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
export class ExpenseDto {
  @Expose()
  @ApiProperty({
    example: 10000,
  })
  amount: number;

  @Expose()
  @ApiProperty({
    example: 'Salaries',
  })
  title: string;

  @Expose()
  @ApiProperty({
    example: '5e4ce015-172c-4ecb-a264-9be315de0c72',
  })
  id: string;
}

@Exclude()
export class FinancialDataResponseDto {
  @Expose()
  @ApiProperty({
    example: '5e4ce015-172c-4ecb-a264-9be315de0c72',
  })
  id: string;

  @Expose()
  @ApiProperty({
    example: new Date(),
  })
  date: Date;

  @Expose()
  @ApiProperty({
    type: [RevenueChannelDto],
  })
  revenueChannels: RevenueChannelDto[];

  @Expose()
  @ApiProperty({
    type: [ExpenseDto],
  })
  expenses: ExpenseDto[];
}

export class ImportFinancialDataDto {
  @IsDateString()
  @ApiProperty({
    example: '2024-01',
  })
  start: Date;

  @IsDateString()
  @ApiProperty({
    example: '2024-12',
  })
  end: Date;

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
