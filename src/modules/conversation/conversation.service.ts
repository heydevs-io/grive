import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Conversation, User } from '@entities';
import { plainToInstance } from 'class-transformer';
import { PageDto, PageMetaDto } from 'src/common/dtos';
import { Repository } from 'typeorm';

import { DifyAiService } from '../dify-ai/dify-ai.service';

import {
  GetConversationHistoryMessagesQueryDto,
  GetConversationHistoryMessagesResponseDto,
  UpsertConversationDto,
} from './dtos';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    private readonly difyAiService: DifyAiService,
  ) {}

  async upsert(
    upsertConversationDto: UpsertConversationDto,
    appCodeAuthorization: string,
    user: User,
  ): Promise<Conversation> {
    const existingConversation = await this.conversationRepository.findOne({
      where: {
        userId: user.id,
        difyConversationId: upsertConversationDto.difyConversationId,
      },
    });

    if (existingConversation) {
      existingConversation.updatedAt = new Date();
      return await this.conversationRepository.save(existingConversation);
    }

    const conversationName = await this.difyAiService.getConversationName(
      upsertConversationDto.difyConversationId,
      true,
      appCodeAuthorization,
    );

    const conversation = this.conversationRepository.create({
      userId: user.id,
      difyConversationId: upsertConversationDto.difyConversationId,
      difyConversationName: conversationName.name,
    });

    return await this.conversationRepository.save(conversation);
  }

  async getUserMessages(
    dto: GetConversationHistoryMessagesQueryDto,
    appCodeAuthorization: string,
    userId: string,
  ): Promise<PageDto<GetConversationHistoryMessagesResponseDto>> {
    const conversation = await this.conversationRepository.findOne({
      where: {
        userId,
      },
    });
    if (!conversation) {
      return new PageDto(
        plainToInstance(GetConversationHistoryMessagesResponseDto, []),
        new PageMetaDto({
          take: dto.take,
          page: dto.page,
          itemCount: 0,
        }),
      );
    }

    const difyResult = await this.difyAiService.getMessagesByConversationDify(
      {
        conversation_id: conversation.difyConversationId,
        limit: dto.take,
        page: dto.page,
      },
      appCodeAuthorization,
    );

    const pageMeta = new PageMetaDto({
      take: difyResult.limit,
      page: difyResult.page,
      itemCount: difyResult.total,
    });

    return new PageDto(
      plainToInstance(
        GetConversationHistoryMessagesResponseDto,
        difyResult.data,
      ),
      pageMeta,
    );
  }

  async getByUserId(userId: string): Promise<Conversation | null> {
    return await this.conversationRepository.findOne({
      where: {
        userId,
      },
    });
  }
}
