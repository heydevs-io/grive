import { CurrentUser } from '@decorators';
import { User } from '@entities';
import {
  Body,
  Controller,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BusinessProfileService } from '../business-profile/business-profile.service';
import { ResponseScenarioDto, UpdateScenarioDto } from './dto';
import { ScenarioService } from './scenario.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards';

@Controller('scenario')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class ScenarioController {
  constructor(
    private readonly scenarioService: ScenarioService,
    private readonly businessProfileService: BusinessProfileService,
  ) {}

  // @Post()
  // createScenario(
  //   @Body() scenario: CreateScenarioDto,
  // ): Promise<ResponseScenarioDto> {
  //   return this.scenarioService.createScenario(scenario);
  // }

  @Put(':scenarioId')
  async updateScenario(
    @Param('scenarioId') scenarioId: string,
    @Body() scenario: UpdateScenarioDto,
    @CurrentUser() user: User,
  ): Promise<ResponseScenarioDto> {
    const business = await this.businessProfileService.getBusinessProfile(
      user.id,
    );
    if (!business) {
      throw new NotFoundException('User has no business profile');
    }
    return this.scenarioService.updateScenario(
      business.id,
      scenarioId,
      scenario,
    );
  }
}
