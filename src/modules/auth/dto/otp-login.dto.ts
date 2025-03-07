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
    example: '111111',
  })
  otp: string;
}

export class MessageResponseDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'This is a message',
  })
  message: string;
}
