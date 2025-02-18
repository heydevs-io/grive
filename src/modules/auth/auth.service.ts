import { UserStatus } from '@enums';
import {
  DEFAULT_OTP,
  NODE_ENV,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
} from '@environments';
import {
  SourcingBadRequestException,
  SourcingInternalServerError,
  SourcingUnauthorizedException,
} from '@exceptions';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { plainToInstance } from 'class-transformer';
import { User } from 'database/entities';
import { UserService } from '../user/user.service';
import {
  AuthToken,
  RequestLoginOtpDto,
  RequestLoginOtpResponseDto,
  VerifyLoginOtpDto,
} from './dto';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {
    this.supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
  }

  async requestLoginOtp(
    payload: RequestLoginOtpDto,
  ): Promise<RequestLoginOtpResponseDto> {
    const { email } = payload;
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      await this.userService.create({ email });
    }

    if (NODE_ENV === 'development' || NODE_ENV === 'local') {
      return plainToInstance(RequestLoginOtpResponseDto, {
        message: 'OTP sent to email',
      });
    }

    const { data, error } = await this.supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) throw new SourcingInternalServerError();

    return plainToInstance(RequestLoginOtpResponseDto, {
      message: 'OTP sent to email',
    });
  }

  async verifyLoginOtp(payload: VerifyLoginOtpDto): Promise<AuthToken> {
    const { email, otp } = payload;
    // check if user is active
    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new SourcingBadRequestException('User not found');

    await this.userService.updateStatus(user.id, {
      status: UserStatus.ACTIVE,
    });

    if (NODE_ENV === 'development' || NODE_ENV === 'local') {
      if (otp !== DEFAULT_OTP) {
        throw new SourcingBadRequestException('Invalid OTP');
      }
      return plainToInstance(AuthToken, {
        accessToken: this.generateToken({
          id: user.id,
        }),
      });
    }

    const { data, error } = await this.supabase.auth.verifyOtp({
      token: otp,
      type: 'email',
      email,
    });

    if (error) throw new SourcingBadRequestException(error.message);

    return plainToInstance(AuthToken, {
      accessToken: this.generateToken({
        id: user.id,
      }),
    });
  }

  async validateUserById(userId: string): Promise<User> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new SourcingUnauthorizedException('Unauthorized');
    }

    const { status } = user;
    if (status !== UserStatus.ACTIVE) {
      throw new SourcingUnauthorizedException(
        'Your account is inactive or blocked',
      );
    }

    return user;
  }

  generateToken(payload: any): string {
    return this.jwtService.sign(payload);
  }
}
