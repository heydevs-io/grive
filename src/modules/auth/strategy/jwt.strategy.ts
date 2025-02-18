import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthConfig } from '@config';
import { SourcingUnauthorizedException } from '@exceptions';
import { AuthService } from '../auth.service';
import { User } from 'database/entities';
import { AuthPayload } from '@interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(AuthConfig.KEY)
    private readonly authConfig: ConfigType<typeof AuthConfig>,
    private readonly authService: AuthService,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: authConfig.jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: AuthPayload): Promise<User> {
    if (!payload) {
      throw new SourcingUnauthorizedException('Unauthorized');
    }

    const { id: userId } = payload;
    const user = await this.authService.validateUserById(userId);

    return user;
  }
}
