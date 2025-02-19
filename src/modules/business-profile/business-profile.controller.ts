import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser, CustomApiResponse } from '../../common/decorators';
import { JwtAuthGuard } from '../auth/guards';
import { BusinessProfileService } from './business-profile.service';
import {
  CreateBusinessProfileDto,
  IndustryOptionDto,
  IndustryResponseDto,
  UpdateBusinessProfileDto,
} from './dto';
import { User } from '../../../database/entities';
import { BusinessProfileResponseDto } from './dto/business-profile-response.dto';

@Controller('business-profile')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class BusinessProfileController {
  constructor(
    private readonly businessProfileService: BusinessProfileService,
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
}
