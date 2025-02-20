import { CurrentUser, CustomApiResponse } from '@decorators';
import { User } from '@entities';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards';
import { BusinessProfileService } from '../business-profile/business-profile.service';
import { ResponseScenarioDto } from '../scenario/dto';
import { ScenarioService } from '../scenario/scenario.service';
import { SimulationService } from '../simulation/simulation.service';
import { BaseInputPlanDto, ResponsePlantDto } from './dto';
import { PlanService } from './plan.service';
@Controller('plan')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class PlanController {
  constructor(
    private readonly planService: PlanService,
    private readonly scenarioService: ScenarioService,
    private readonly simulationService: SimulationService,
    private readonly businessProfileService: BusinessProfileService,
  ) {}

  @Post()
  @CustomApiResponse(ResponsePlantDto)
  async createPlan(
    @Body() plan: BaseInputPlanDto,
    @CurrentUser() user: User,
  ): Promise<ResponsePlantDto> {
    const business = await this.businessProfileService.getBusinessProfile(
      user.id,
    );
    if (!business) {
      throw new NotFoundException('User has no business profile');
    }
    return this.planService.createPlan({
      ...plan,
      startDate: new Date(plan.startDate),
      businessId: business.id,
    });
  }

  @Put(':planId')
  @CustomApiResponse(ResponsePlantDto)
  async updatePlan(
    @Param('planId') planId: string,
    @Body() plan: BaseInputPlanDto,
  ): Promise<ResponsePlantDto> {
    return this.planService.updatePlan(planId, plan);
  }
  @Get(':plantId/scenarios')
  @CustomApiResponse(ResponseScenarioDto, true)
  async getScenarios(
    @Param('plantId') planId: string,
  ): Promise<ResponseScenarioDto[]> {
    return this.scenarioService.getScenarios(planId);
  }

  @Get(':planId/generate-scenario')
  @CustomApiResponse(ResponseScenarioDto, true)
  async generateScenario(
    @Param('planId') planId: string,
    @CurrentUser() user: User,
  ) {
    const plan = await this.planService.getPlan(planId);
    const business = await this.businessProfileService.getBusinessProfile(
      user.id,
    );
    if (!business) {
      throw new NotFoundException('User has no business profile');
    }
    if (plan.businessId !== business.id) {
      throw new BadRequestException('No permission to update this plan');
    }
    const planResult = await this.planService.getPlan(planId);
    const scenarios = await this.scenarioService.generateScenario(
      planId,
      planResult,
    );
    return plainToInstance(ResponseScenarioDto, scenarios);
  }

  @Get(':planId/simulation/:scenarioId')
  async getSimulation(
    @Param('planId') planId: string,
    @Param('scenarioId') scenarioId: string,
  ) {
    const plan = await this.planService.getPlan(planId);
    const scenario = await this.scenarioService.getScenario(scenarioId);
    return this.simulationService.runSimulation({ plan, scenario });
  }
}
