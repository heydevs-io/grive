import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FinancialDataOptionsDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ example: 2020 })
  fromYear: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @ApiProperty({ example: 2021 })
  toYear: number;
}
