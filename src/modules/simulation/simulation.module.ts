import { Scenario, Simulation } from '@entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimulationService } from './simulation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Scenario, Simulation])],
  providers: [SimulationService],
  exports: [SimulationService],
})
export class SimulationModule {}
