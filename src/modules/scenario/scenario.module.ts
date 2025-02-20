import { Scenario } from '@entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessProfileModule } from '../business-profile/business-profile.module';
import { ScenarioController } from './scenario.controller';
import { ScenarioService } from './scenario.service';

@Module({
  imports: [TypeOrmModule.forFeature([Scenario]), BusinessProfileModule],
  controllers: [ScenarioController],
  providers: [ScenarioService],
  exports: [ScenarioService],
})
export class ScenarioModule {}
