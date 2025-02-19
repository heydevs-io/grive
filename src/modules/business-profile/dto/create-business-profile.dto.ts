import { BusinessFocus, BusinessType } from '@enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateBusinessProfileDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'Business Name',
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    example: 'https://www.business.com',
  })
  website: string;

  @IsOptional()
  @IsDateString()
  @ApiPropertyOptional({
    example: '2023-01',
  })
  foundedDate?: Date;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: '<$3000',
  })
  monthlyRevenueAvg?: string;

  @IsOptional()
  @IsEnum(BusinessType)
  @ApiPropertyOptional({
    enum: BusinessType,
    example: BusinessType.SERVICE,
  })
  businessType: BusinessType;

  @IsString()
  @ApiPropertyOptional({
    example: 'Other business type',
  })
  @ValidateIf((object, value) => object.businessType === BusinessType.OTHER)
  businessTypeOther?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: '700',
  })
  industrySIC?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    example: 'Creative service',
  })
  specificService?: string;

  @IsEnum(BusinessFocus)
  @IsOptional()
  @ApiPropertyOptional({
    enum: BusinessFocus,
    example: BusinessFocus.BUSINESS_GROWTH_HEALTH,
  })
  focus?: BusinessFocus;
}
export class UpdateBusinessProfileDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Business Name',
  })
  name?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'https://www.business.com',
  })
  website?: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({
    example: '2023-01',
  })
  foundedDate: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: '<$3000',
  })
  monthlyRevenueAvg: string;

  @IsNotEmpty()
  @IsEnum(BusinessType)
  @ApiProperty({
    enum: BusinessType,
    example: BusinessType.SERVICE,
  })
  businessType: BusinessType;

  @IsString()
  @ApiProperty({
    example: 'Other business type',
  })
  @ValidateIf((object, value) => object.businessType === BusinessType.OTHER)
  businessTypeOther?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '700',
  })
  industrySIC: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Creative service',
  })
  specificService: string;

  @IsEnum(BusinessFocus)
  @ApiProperty({
    enum: BusinessFocus,
    example: BusinessFocus.BUSINESS_GROWTH_HEALTH,
  })
  focus: BusinessFocus;
}
