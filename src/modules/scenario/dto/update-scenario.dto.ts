import { IsNumber, IsOptional } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateScenarioDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 1000,
    required: false,
  })
  monthlyTakeHome?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 1000,
    required: false,
  })
  projectRevenue?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 1000,
    required: false,
  })
  recommendedCashReserve?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 1000,
    required: false,
  })
  recommendedMonthlyInvestment?: number;
}
