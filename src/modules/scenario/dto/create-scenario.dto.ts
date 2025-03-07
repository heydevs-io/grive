import { IsEnum, IsNumber, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { ScenarioType } from '../../../common/enums';

export class CreateScenarioDto {
  @IsString()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  planId: string;

  @IsEnum(ScenarioType)
  @ApiProperty({
    enum: ScenarioType,
    example: ScenarioType.CONSERVATION,
  })
  type: ScenarioType;

  @IsNumber()
  @ApiProperty({
    example: 1000,
  })
  monthlyTakeHome: number;

  @IsNumber()
  @ApiProperty({
    example: 1000,
  })
  projectRevenue: number;

  @IsNumber()
  @ApiProperty({
    example: 1000,
  })
  recommendedCashReserve: number;

  @IsNumber()
  @ApiProperty({
    example: 1000,
  })
  recommendedMonthlyInvestment: number;
}
