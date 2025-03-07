import { Scenario } from '@entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ScenarioType } from '../../common/enums';
import { BaseInputPlanDto } from '../plan/dto';
import {
  CreateScenarioDto,
  ResponseScenarioDto,
  UpdateScenarioDto,
} from './dto';
@Injectable()
export class ScenarioService {
  constructor(
    @InjectRepository(Scenario)
    private scenarioRepository: Repository<Scenario>,
  ) {}

  async createScenario(
    scenario: CreateScenarioDto,
  ): Promise<ResponseScenarioDto> {
    const createdScenario = await this.scenarioRepository.save(scenario);
    return plainToClass(ResponseScenarioDto, createdScenario);
  }

  async getScenarios(planId: string): Promise<ResponseScenarioDto[]> {
    const scenarios = await this.scenarioRepository.find({
      where: { planId },
    });
    return scenarios.map((scenario) =>
      plainToClass(ResponseScenarioDto, scenario),
    );
  }

  async updateScenario(
    businessId: string,
    scenarioId: string,
    scenario: UpdateScenarioDto,
  ): Promise<ResponseScenarioDto> {
    const existingScenario = await this.scenarioRepository
      .createQueryBuilder('scenario')
      .leftJoin('scenario.plan', 'plan')
      .where('scenario.id = :scenarioId', { scenarioId })
      .andWhere('plan.businessId = :businessId', { businessId })
      .getOne();
    if (!existingScenario) {
      throw new NotFoundException('Scenario not found');
    }
    const result = await this.scenarioRepository.update(scenarioId, scenario);
    if (result.affected === 0) {
      throw new NotFoundException('Failed to update scenario');
    }
    const updatedScenario = await this.scenarioRepository.findOne({
      where: { id: scenarioId },
    });
    return plainToClass(ResponseScenarioDto, updatedScenario);
  }

  async getScenario(scenarioId: string): Promise<ResponseScenarioDto> {
    const scenario = await this.scenarioRepository.findOne({
      where: { id: scenarioId },
    });
    return plainToClass(ResponseScenarioDto, scenario);
  }

  async generateScenario(
    planId: string,
    planData: BaseInputPlanDto,
  ): Promise<ResponseScenarioDto[]> {
    //TODO: Implement the logic to generate the scenario

    const scenarios = [
      {
        id: uuidv4(),
        planId,
        type: ScenarioType.CONSERVATION,
        monthlyTakeHome: 1000,
        projectRevenue: 1000,
        recommendedCashReserve: 800, // Majority saved
        recommendedMonthlyInvestment: 200, // Minimal investment
      },
      {
        id: uuidv4(),
        planId,
        type: ScenarioType.MODERATE,
        monthlyTakeHome: 1500,
        projectRevenue: 2000,
        recommendedCashReserve: 1000, // Balanced savings
        recommendedMonthlyInvestment: 1000, // Balanced investment
      },
      {
        id: uuidv4(),
        planId,
        type: ScenarioType.AGGRESSIVE,
        monthlyTakeHome: 2500,
        projectRevenue: 4000,
        recommendedCashReserve: 200, // Minimal savings
        recommendedMonthlyInvestment: 3800, // Majority invested
      },
    ];

    await this.scenarioRepository.delete({ planId });

    await this.scenarioRepository.save(scenarios);

    return scenarios.map((scenario) =>
      plainToClass(ResponseScenarioDto, scenario),
    );
  }
}
