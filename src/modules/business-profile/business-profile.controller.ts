import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser, CustomApiResponse } from '@decorators';
import { JwtAuthGuard } from '../auth/guards';
import { BusinessProfileService } from './business-profile.service';
import {
  CreateBusinessProfileDto,
  IndustryOptionDto,
  IndustryResponseDto,
  UpdateBusinessProfileDto,
  BusinessProfileResponseDto,
  UpdateProfileDto,
} from './dto';
import { User } from '@entities';
import { UserService } from '../user/user.service';
@Controller('business-profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class BusinessProfileController {
  constructor(
    private readonly businessProfileService: BusinessProfileService,
    private readonly userService: UserService,
  ) {}

  @Post()
  create(
    @Body() createBusinessProfileDto: CreateBusinessProfileDto,
    @CurrentUser() user: User,
  ) {
    return this.businessProfileService.create(
      createBusinessProfileDto,
      user.id,
    );
  }

  @Get('own')
  @CustomApiResponse(BusinessProfileResponseDto)
  getBusinessProfile(@CurrentUser() user: User) {
    return this.businessProfileService.getBusinessProfile(user.id);
  }

  @Put('own')
  @CustomApiResponse(BusinessProfileResponseDto)
  update(
    @Body() updateBusinessProfileDto: UpdateBusinessProfileDto,
    @CurrentUser() user: User,
  ) {
    return this.businessProfileService.update(
      updateBusinessProfileDto,
      user.id,
    );
  }

  @Get('industries')
  @CustomApiResponse(IndustryResponseDto, true)
  getIndustries(@Query() query: IndustryOptionDto) {
    return this.businessProfileService.getIndustries(query.category);
  }

  @Put('profile')
  // @CustomApiResponse(UserResponseDto)
  async updateProfile(
    @CurrentUser() user: User,
    @Body() payload: UpdateProfileDto,
  ) {
    const { fullName, ...businessProfilePayload } = payload;
    await this.userService.updateUser(user.id, {
      name: fullName,
    });
    await this.businessProfileService.update(
      businessProfilePayload as UpdateBusinessProfileDto,
      user.id,
    );
    return {
      isUpdate: true,
    };
  }
}
