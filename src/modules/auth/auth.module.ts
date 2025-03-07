import { AuthConfig } from '@config';
import { BusinessProfile } from '@entities';
import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';
@Module({
  imports: [
    TypeOrmModule.forFeature([BusinessProfile]),
    JwtModule.registerAsync({
      global: true,
      inject: [AuthConfig.KEY],
      useFactory: (configService: ConfigType<typeof AuthConfig>) => {
        return {
          secret: configService.jwtSecret,
          signOptions: {
            expiresIn: configService.accessTokenExpiration,
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
export class AuthModule { }
