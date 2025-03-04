import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { DifyAiConfig } from 'src/config';

import { ConversationModule } from '../conversation/conversation.module';

import { DifyAiService } from './dify-ai.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      inject: [DifyAiConfig.KEY],
      useFactory: (config: ConfigType<typeof DifyAiConfig>) => {
        return {
          baseURL: config.baseUrl,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
  ],
  providers: [DifyAiService, JwtService],
  exports: [DifyAiService],
})
export class DifyAiModule {}
