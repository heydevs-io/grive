/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Readable } from 'stream';

import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { fetchDto, fetchStreamDto } from '@http';
import { AxiosHeaders } from 'axios';

import { DIFY_APP_CODE } from '@environments';
import { ConversationService } from '../conversation/conversation.service';
import {
  ChatMessageRequestDto,
  GetConversationHistoryMessagesDifyDto,
  GetConversationHistoryMessagesDifyQueryDto,
  GetConversationHistoryMessagesDifyResponseDto,
  GetNameConversationDifyDto,
  GetNameConversationDifyResponseDto,
  GetPassportDto,
  GetPassportResponseDto,
  InternalApiDifyAiHeaderDto,
  LoginWithoutPasswordDifyAiBodyDto,
  LoginWithoutPasswordDifyAiResponseDto,
  PostChatMessageDto,
  PostLoginWithoutPasswordDifyAiDto,
} from './dtos';

@Injectable()
export class DifyAiService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async loginWithoutPassword(
    body: LoginWithoutPasswordDifyAiBodyDto,
  ): Promise<LoginWithoutPasswordDifyAiResponseDto> {
    const dto = new PostLoginWithoutPasswordDifyAiDto(body);

    const response = await fetchDto<LoginWithoutPasswordDifyAiResponseDto>({
      httpService: this.httpService,
      dto,
      headers: new AxiosHeaders({
        ...new InternalApiDifyAiHeaderDto(
          this.configService.get('DIFY_AI_INNER_API_KEY') ?? '',
        ),
      }),
    });

    return response.data;
  }

  async chatMessageStream(
    input: ChatMessageRequestDto,
    token: string,
  ): Promise<Readable> {
    const dto = new PostChatMessageDto({
      ...input,
      files: [],
      inputs: {},
      parent_message_id: null,
    });
    const response = await fetchStreamDto({
      httpService: this.httpService,
      headers: new AxiosHeaders({
        Authorization: `Bearer ${token}`,
      }),
      dto,
    });

    if (!response.status) {
      throw new HttpException(
        response.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return response.data;
  }

  async getMessagesByConversationDify(
    input: GetConversationHistoryMessagesDifyQueryDto,
    appCodeAuthorization: string,
  ): Promise<GetConversationHistoryMessagesDifyResponseDto> {
    const decodedToken = this.jwtService.decode(appCodeAuthorization);

    const loginResponse = await this.loginWithoutPassword({
      email: this.configService.get('DIFY_AI_EMAIL') ?? '',
    });

    const dto = new GetConversationHistoryMessagesDifyDto(input, {
      app_id: decodedToken.app_id,
    });

    const response =
      await fetchDto<GetConversationHistoryMessagesDifyResponseDto>({
        httpService: this.httpService,
        dto,
        headers: new AxiosHeaders({
          Authorization: `Bearer ${loginResponse.data}`,
        }),
      });

    if (!response.status) {
      throw new HttpException(
        response.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return response.data;
  }

  async getConversationName(
    conversationId: string,
    autoGenerate: boolean,
    appCodeAuthorization: string,
  ): Promise<GetNameConversationDifyResponseDto> {
    const dto = new GetNameConversationDifyDto(
      { auto_generate: autoGenerate },
      { conversation_id: conversationId },
    );

    const response = await fetchDto<GetNameConversationDifyResponseDto>({
      httpService: this.httpService,
      dto,
      headers: new AxiosHeaders({
        Authorization: `Bearer ${appCodeAuthorization}`,
      }),
    });

    if (!response.status) {
      throw new HttpException(
        response.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { name: response.data.name };
  }

  async getPassport(email: string): Promise<GetPassportResponseDto> {
    const dto = new GetPassportDto({ email });

    const response = await fetchDto<GetPassportResponseDto>({
      httpService: this.httpService,
      dto,
      headers: new AxiosHeaders({
        'X-App-Code': DIFY_APP_CODE,
      }),
    });

    return response.data;
  }
}
