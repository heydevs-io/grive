import { SourcingApiResponse } from '@decorators';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthToken,
  RequestLoginOtpDto,
  RequestLoginOtpResponseDto,
  VerifyLoginOtpDto,
} from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-login-otp')
  @SourcingApiResponse(RequestLoginOtpResponseDto)
  async requestLoginOtp(@Body() payload: RequestLoginOtpDto) {
    return this.authService.requestLoginOtp(payload);
  }

  @Post('verify-login-otp')
  @SourcingApiResponse(AuthToken)
  async verifyLoginOtp(@Body() payload: VerifyLoginOtpDto) {
    return this.authService.verifyLoginOtp(payload);
  }
}
