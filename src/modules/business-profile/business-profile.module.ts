import { Module } from '@nestjs/common';
import { BusinessProfileService } from './business-profile.service';
import { BusinessProfileController } from './business-profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessProfile } from '@entities';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessProfile]), UserModule],
  controllers: [BusinessProfileController],
  providers: [BusinessProfileService],
  exports: [BusinessProfileService],
})
export class BusinessProfileModule {}
