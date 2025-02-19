import { BusinessFocus, BusinessType } from '@enums';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class BusinessProfileResponseDto {
  @Expose()
  @ApiProperty({ example: 'Company Name' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'https://www.company.com' })
  website: string;

  @Expose()
  @ApiProperty({ example: new Date() })
  foundedDate: Date;

  @Expose()
  @ApiProperty({ example: '100000' })
  monthlyRevenueAvg: string;

  @Expose()
  @ApiProperty({ example: BusinessType.CONSTRUCTION, enum: BusinessType })
  businessType: BusinessType;

  @Expose()
  @ApiProperty({ example: 'Other Business Type' })
  businessTypeOther: string;

  @Expose()
  @ApiProperty({ example: 'Industry Title' })
  industryTitle: string;

  @Expose()
  @ApiProperty({ example: '123456' })
  industrySIC: string;

  @Expose()
  @ApiProperty({ example: 'Specific Service' })
  specificService: string;

  @Expose()
  @ApiProperty({
    example: BusinessFocus.BUSINESS_GROWTH_HEALTH,
    enum: BusinessFocus,
  })
  focus: BusinessFocus;
}
