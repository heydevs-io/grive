import { BusinessType } from '@enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export class IndustryOptionDto {
  @IsEnum(BusinessType)
  @IsOptional()
  @ApiProperty({ enum: BusinessType, required: false })
  category?: BusinessType;
}

export class IndustryResponseDto {
  @ApiProperty({ example: '700000' })
  code: string;
  @ApiProperty({ example: 'Manufacturing' })
  title: string;
  @ApiProperty({ example: BusinessType.SERVICE })
  category: BusinessType;
}
