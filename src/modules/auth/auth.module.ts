import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'database/entities';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigType } from '@nestjs/config';
import { JwtStrategy } from './strategy';
import { AuthConfig } from '../../config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [AuthConfig.KEY],
      useFactory: (configService: ConfigType<typeof AuthConfig>) => {
        return {
          secret: configService.jwtSecret,
          signOptions: {
            expiresIn: parseInt(configService.accessTokenExpiration!, 10),
          },
        };
      },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
