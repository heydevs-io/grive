import { DynamicModule } from '@nestjs/common';
import { DevModeController } from './dev-mode.controller';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'database/entities';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { DevModeService } from './dev-mode.service';

export class DevModeModule {
  static config = new ConfigService();

  static registerAsync(): DynamicModule {
    const controllers =
      DevModeModule.config.get('NODE_ENV') === 'development'
        ? [DevModeController]
        : [];

    return {
      imports: [TypeOrmModule.forFeature([User]), AuthModule, UserModule],
      module: DevModeModule,
      providers: [DevModeService],
      controllers,
    };
  }
}
