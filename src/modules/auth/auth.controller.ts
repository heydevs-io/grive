import { CustomApiResponse } from '@decorators';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthToken,
  MessageResponseDto,
  RequestLoginOtpDto,
  VerifyLoginOtpDto,
} from './dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @CustomApiResponse(MessageResponseDto)
  async signUp(@Body() payload: SignUpDto) {
    return this.authService.signUp(payload);
  }

  @Post('sign-in')
  @CustomApiResponse(MessageResponseDto)
  async signIn(@Body() payload: RequestLoginOtpDto) {
    return this.authService.signIn(payload);
  }

  @Post('verify-login-otp')
  @CustomApiResponse(AuthToken)
  async verifyLoginOtp(@Body() payload: VerifyLoginOtpDto) {
    return this.authService.verifyLoginOtp(payload);
  }
}
