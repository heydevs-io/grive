import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { ScenarioType } from '../../../common/enums';
@Exclude()
export class ResponseScenarioDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    example: ScenarioType.CONSERVATION,
  })
  @Expose()
  type: ScenarioType;

  @ApiProperty({
    example: 1000,
  })
  @Expose()
  monthlyTakeHome: number;

  @ApiProperty({
    example: 1000,
  })
  @Expose()
  projectRevenue: number;

  @ApiProperty({
    example: 1000,
  })
  @Expose()
  recommendedCashReserve: number;

  @ApiProperty({
    example: 1000,
  })
  @Expose()
  recommendedMonthlyInvestment: number;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  planId: string;
}
