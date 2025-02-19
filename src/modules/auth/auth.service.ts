import { UserStatus } from '@enums';
import {
  DEFAULT_OTP,
  NODE_ENV,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
} from '@environments';
import {
  CustomBadRequestException,
  CustomInternalServerError,
  CustomNotFoundException,
  CustomUnauthorizedException,
} from '@exceptions';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { plainToInstance } from 'class-transformer';
import { BusinessProfile, User } from 'database/entities';
import { UserService } from '../user/user.service';
import {
  AuthToken,
  MessageResponseDto,
  RequestLoginOtpDto,
  VerifyLoginOtpDto,
} from './dto';
import { SignUpDto } from './dto/sign-up.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  private supabase: SupabaseClient;
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,

    @InjectRepository(BusinessProfile)
    private readonly businessProfileRepository: Repository<BusinessProfile>,
  ) {
    this.supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
  }

  async signUp(payload: SignUpDto) {
    const { email, companyName, companyWebsite } = payload;

    let user = await this.userService.getUserByEmail(email);
    if (user && user.status === UserStatus.ACTIVE)
      throw new CustomBadRequestException('User already exists');

    if (!user) user = await this.userService.createUser({ email });

    await this.businessProfileRepository.upsert(
      {
        name: companyName,
        website: companyWebsite,
        userId: user.id,
      },
      {
        conflictPaths: ['userId'],
      },
    );

    await this.sendOtpToEmail(email);

    return plainToInstance(MessageResponseDto, {
      message: 'OTP sent to email',
    });
  }

  async signIn(payload: RequestLoginOtpDto): Promise<MessageResponseDto> {
    const { email } = payload;
    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new CustomNotFoundException('User not found');

    if (user.status !== UserStatus.ACTIVE)
      throw new CustomBadRequestException('User is not active');

    await this.sendOtpToEmail(email);

    return plainToInstance(MessageResponseDto, {
      message: 'OTP sent to email',
    });
  }

  async verifyLoginOtp(payload: VerifyLoginOtpDto): Promise<AuthToken> {
    const { email, otp } = payload;
    // check if user is active
    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new CustomBadRequestException('User not found');

    await this.userService.updateStatus(user.id, UserStatus.ACTIVE);

    if (NODE_ENV === 'development' || NODE_ENV === 'local') {
      if (otp !== DEFAULT_OTP) {
        throw new CustomBadRequestException('Invalid OTP');
      }
      return plainToInstance(AuthToken, {
        accessToken: this.generateToken({
          id: user.id,
          name: user.name,
          email: user.email,
        }),
        onboardingComplete: user.businessProfile?.onboardingComplete || false,
      });
    }

    const { data, error } = await this.supabase.auth.verifyOtp({
      token: otp,
      type: 'email',
      email,
    });

    if (error) throw new CustomBadRequestException(error.message);

    return plainToInstance(AuthToken, {
      accessToken: this.generateToken({
        id: user.id,
        name: user.name,
        email: user.email,
      }),
      onboardingComplete: user.businessProfile?.onboardingComplete || false,
    });
  }

  async validateUserById(userId: string): Promise<User> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new CustomUnauthorizedException('Unauthorized');
    }

    const { status } = user;
    if (status !== UserStatus.ACTIVE) {
      throw new CustomUnauthorizedException(
        'Your account is inactive or blocked',
      );
    }

    return user;
  }

  generateToken(payload: any): string {
    return this.jwtService.sign(payload);
  }

  private async sendOtpToEmail(email: string): Promise<void> {
    if (NODE_ENV === 'development' || NODE_ENV === 'local') {
      return;
    }

    const { data, error } = await this.supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });

    if (error) throw new CustomInternalServerError();
  }
}
