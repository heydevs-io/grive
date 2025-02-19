import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthToken } from '../auth/dto';
import { UserService } from '../user/user.service';
import { CustomBadRequestException } from '@exceptions';
import { UserStatus } from '@enums';

@Injectable()
export class DevModeService {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  async getAccessTokenByEmail(email: string): Promise<AuthToken> {
    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new CustomBadRequestException('User not found');
    if (user.status !== UserStatus.ACTIVE)
      throw new CustomBadRequestException('User is not active');
    return {
      accessToken: this.authService.generateToken({ id: user.id }),
    };
  }
}
