import { Module } from '@nestjs/common';
import { ForecastService } from './forecast.service';
import { ForecastController } from './forecast.controller';

@Module({
  controllers: [ForecastController],
  providers: [ForecastService],
})
export class ForecastModule {}
