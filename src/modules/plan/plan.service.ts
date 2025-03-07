import { Plan } from '@entities';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { Repository } from 'typeorm';
import { DeleteResponse, ResponsePlantDto } from './dto';
import { BaseInputPlanDto } from './dto/create-plan.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
  ) {}

  async createPlan(plan: BaseInputPlanDto): Promise<ResponsePlantDto> {
    const createdPlan = await this.planRepository.save(plan);
    return plainToClass(ResponsePlantDto, createdPlan);
  }

  async getPlan(id: string): Promise<ResponsePlantDto> {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException('Plan not found');
    }
    return plainToClass(ResponsePlantDto, plan);
  }

  async updatePlan(
    id: string,
    plan: BaseInputPlanDto,
  ): Promise<ResponsePlantDto> {
    await this.planRepository.update(id, plan);
    const updatedPlan = await this.planRepository.findOne({ where: { id } });
    return plainToClass(ResponsePlantDto, updatedPlan);
  }

  async deletePlan(id: string): Promise<DeleteResponse> {
    await this.planRepository.softDelete(id);
    return { isDeleted: true };
  }
}
