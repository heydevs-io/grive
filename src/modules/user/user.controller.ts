import { CurrentUser, CustomApiResponse } from '@decorators';
import { User } from '@entities';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';
import { UserResponseDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('me')
  @CustomApiResponse(UserResponseDto)
  getMe(@CurrentUser() user: User) {
    return this.userService.getUserById(user.id);
  }
}
