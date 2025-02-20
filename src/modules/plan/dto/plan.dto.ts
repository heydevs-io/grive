import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { Exclude } from 'class-transformer';

@Exclude()
export class ResponsePlantDto {
  @Expose()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @Expose()
  @ApiProperty({
    example: 'Plan name',
  })
  name: string;

  @Expose()
  @ApiProperty({
    example: '2021-01-01',
  })
  startDate: Date;

  @Expose()
  @ApiProperty({
    example: 12,
  })
  reverseDuration: number;

  @Expose()
  @ApiProperty({
    example: 100000,
  })
  monthlyRevenue: number;

  @Expose()
  @ApiProperty({
    example: 100000,
  })
  operatingCost: number;

  @Expose()
  @ApiProperty({
    example: 100000,
  })
  taxRate: number;

  @Expose()
  @ApiProperty({
    example: 100000,
  })
  creditAccess: number;

  @Expose()
  @ApiProperty({
    example: 100000,
  })
  monthlyPersonalExpense: number;

  @Expose()
  @ApiProperty({
    example: 100000,
  })
  personalExpenseReserveDuration: number;

  @Expose()
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  businessId: string;
}

export class UpdateResponse {
  @Expose()
  @ApiProperty({
    example: true,
  })
  isUpdated: boolean;
}

export class DeleteResponse {
  @Expose()
  @ApiProperty({
    example: true,
  })
  isDeleted: boolean;
}
