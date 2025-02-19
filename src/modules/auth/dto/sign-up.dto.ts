import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'john.doe@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Company Name',
  })
  companyName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'https://www.example.com',
  })
  companyWebsite?: string;
}
