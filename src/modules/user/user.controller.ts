import { CurrentUser, CustomApiResponse } from '@decorators';
import { User } from '@entities';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';
import { UserService } from './user.service';
import { UserResponseDto } from './dto';
import { plainToInstance } from 'class-transformer';

@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @CustomApiResponse(UserResponseDto)
  getMe(@CurrentUser() user: User) {
    return plainToInstance(
      UserResponseDto,
      this.userService.getUserById(user.id),
    );
  }
}
