import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { User } from '@entities';

import { CurrentUser, CustomApiResponse } from '@decorators';

import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards';
import { DifyAiService } from '../dify-ai/dify-ai.service';
import { ChatMessageRequestDto, GetPassportResponseDto } from '../dify-ai/dtos';
import { ConversationService } from './conversation.service';
import { GetConversationHistoryMessagesQueryDto } from './dtos';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('conversations')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly difyAiService: DifyAiService,
  ) {}

  @Get('messages')
  @HttpCode(HttpStatus.OK)
  async getMessage(
    @Query() dto: GetConversationHistoryMessagesQueryDto,
    @Headers('dify-authorization') difyToken: string,
    @CurrentUser() user: User,
  ) {
    return await this.conversationService.getUserMessages(
      dto,
      difyToken,
      user.id,
    );
  }

  @Post('chat-stream')
  async chatStream(
    @Body() body: ChatMessageRequestDto,
    @Res() res: Response,
    @Headers('dify-authorization') difyToken: string,
    @CurrentUser() user: User,
  ) {
    const conversation = await this.conversationService.getByUserId(user.id);
    const result = await this.difyAiService.chatMessageStream(
      {
        ...body,
        conversation_id: conversation?.difyConversationId || '',
      },
      difyToken,
    );

    // Set the appropriate headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let conversationId = conversation?.difyConversationId || '';

    result.on('data', (chunk: Buffer) => {
      if (!conversationId) {
        const lines = chunk.toString().split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.event === 'message_end') {
                conversationId = data.conversation_id;
              }
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
              continue;
            }
          }
        }
      }
      res.write(chunk);
    });

    result.on('end', () => {
      void (async () => {
        await this.conversationService.upsert(
          { difyConversationId: conversationId },
          difyToken,
          user,
        );
        res.end();
      })();
    });
  }

  @Get('get-dify-token')
  @HttpCode(HttpStatus.OK)
  @CustomApiResponse(GetPassportResponseDto)
  async getPassport(
    @CurrentUser() user: User,
  ): Promise<GetPassportResponseDto> {
    return this.difyAiService.getPassport(user.email);
  }
}
