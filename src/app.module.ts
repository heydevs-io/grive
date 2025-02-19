import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType, ConfigService } from '@nestjs/config';
import { validate } from '@validate';
import {
  AuthModule,
  BusinessProfileModule,
  FinancialDataModule,
  UserModule,
} from './modules';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { configs, DatabaseConfig, LogConfig } from './config';
import { WinstonModule, WinstonModuleOptions } from 'nest-winston';
import { APP_FILTER } from '@nestjs/core';
import { GlobalHandleExceptionFilter } from './common/exceptions';

const modules = [
  AuthModule,
  UserModule,
  BusinessProfileModule,
  FinancialDataModule,
  UserModule,
];
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
      validate,
      load: configs,
    }),
    ...modules,

    TypeOrmModule.forRootAsync({
      inject: [DatabaseConfig.KEY],
      useFactory: (config: ConfigType<typeof DatabaseConfig>) => {
        if (!config) {
          throw new Error('Cannot start app without ORM config');
        }
        return config as TypeOrmModuleOptions;
      },

      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
    }),

    WinstonModule.forRootAsync({
      inject: [LogConfig.KEY],
      useFactory: (config: ConfigType<typeof LogConfig>) => {
        if (!config) {
          throw new Error('Cannot start app without winston config');
        }
        return config as WinstonModuleOptions;
      },
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalHandleExceptionFilter,
    },
  ],
})
export class AppModule {}
