import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RequestLoginOtpDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'john.doe@example.com',
  })
  email: string;
}

export class VerifyLoginOtpDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'john.doe@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
  })
  otp: string;
}

export class RequestLoginOtpResponseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'This is a message',
  })
  message: string;
}
