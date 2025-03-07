import { Module } from '@nestjs/common';
import { LiabilityService } from './liability.service';
import { LiabilityController } from './liability.controller';

@Module({
  controllers: [LiabilityController],
  providers: [LiabilityService],
})
export class LiabilityModule {}
