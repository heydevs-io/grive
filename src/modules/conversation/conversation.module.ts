import { forwardRef, Module } from '@nestjs/common';

import { DifyAiModule } from '../dify-ai/dify-ai.module';
import { Conversation } from '@entities';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';

@Module({
  imports: [DifyAiModule, TypeOrmModule.forFeature([Conversation])],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
