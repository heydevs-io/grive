import { Module } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PlanController } from './plan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from '@entities';
import { ScenarioModule } from '../scenario/scenario.module';
import { SimulationModule } from '../simulation/simulation.module';
import { BusinessProfileModule } from '../business-profile/business-profile.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Plan]),
    ScenarioModule,
    SimulationModule,
    BusinessProfileModule,
  ],
  controllers: [PlanController],
  providers: [PlanService],
})
export class PlanModule {}
