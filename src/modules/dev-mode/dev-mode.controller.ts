import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DevModeService } from './dev-mode.service';
import { AuthToken } from '../auth/dto';
import { CustomApiResponse } from '@decorators';

@Controller('dev-mode')
@ApiTags('DevMode')
export class DevModeController {
  constructor(private readonly devModeService: DevModeService) {}

  @Get('access-token')
  @CustomApiResponse(AuthToken)
  getAccessTokenByEmail(@Query('email') email: string): Promise<AuthToken> {
    return this.devModeService.getAccessTokenByEmail(email);
  }
}
