import { BusinessType, DateFormat } from '@enums';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DateJS,
  getAllSicCodes,
  getSicCodesByCategory,
  getSicCodeTitle,
} from '@utils';
import { Repository } from 'typeorm';
import {
  CreateBusinessProfileDto,
  UpdateBusinessProfileDto,
} from './dto/create-business-profile.dto';
import {
  CustomBadRequestException,
  CustomNotFoundException,
} from '@exceptions';
import { plainToInstance } from 'class-transformer';
import { BusinessProfileResponseDto } from './dto';
import { BusinessProfile } from '@entities';

@Injectable()
export class BusinessProfileService {
  constructor(
    @InjectRepository(BusinessProfile)
    private readonly businessProfileRepository: Repository<BusinessProfile>,
  ) {}

  async getIndustries(category?: BusinessType) {
    if (!category || category === BusinessType.OTHER) {
      return getAllSicCodes();
    }
    return getSicCodesByCategory(category);
  }

  async create(payload: CreateBusinessProfileDto, userId: string) {
    const data: any = {
      ...payload,
      userId,
    };
    if (payload.industrySIC) {
      const industryTitle = getSicCodeTitle(payload.industrySIC);
      if (!industryTitle)
        throw new CustomBadRequestException('Invalid industry SIC code');
      data.industryTitle = industryTitle;
    }
    const businessProfile = this.businessProfileRepository.create(data);
    return await this.businessProfileRepository.save(businessProfile);
  }

  async update(payload: UpdateBusinessProfileDto, userId: string) {
    const businessProfile = await this.businessProfileRepository.findOne({
      where: { userId },
    });

    if (!businessProfile)
      throw new CustomNotFoundException('Business profile not found');

    const data: any = {
      ...payload,
      userId,
      foundedDate: DateJS.format(payload.foundedDate, 'YYYY-MM'),
    };
    if (payload.industrySIC) {
      const industryTitle = getSicCodeTitle(payload.industrySIC);
      if (!industryTitle)
        throw new CustomBadRequestException('Invalid industry SIC code');
      data.industryTitle = industryTitle;
    }

    const res = await this.businessProfileRepository.update(
      businessProfile.id,
      {
        ...data,
        onboardingComplete: true,
      },
    );

    if (!res || res.affected === 0)
      throw new CustomBadRequestException('Failed to update business profile');

    return plainToInstance(UpdateBusinessProfileDto, {
      isUpdated: true,
    });
  }

  async getBusinessProfile(userId: string) {
    const businessProfile = await this.businessProfileRepository.findOne({
      where: { userId },
    });
    if (!businessProfile || !businessProfile.onboardingComplete) return null;
    return plainToInstance(BusinessProfileResponseDto, businessProfile);
  }
}
