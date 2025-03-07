import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class BaseInputPlanDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Plan name',
  })
  name: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2021-01',
  })
  startDate: Date;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    example: 12,
  })
  reverseDuration: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 100000,
  })
  monthlyRevenue?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 100000,
  })
  operatingCost?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 100000,
  })
  taxRate?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 100000,
  })
  creditAccess?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 100000,
  })
  monthlyPersonalExpense?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 100000,
  })
  personalExpenseReserveDuration?: number;

  businessId: string;
}
