import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { HttpMethod } from 'src/common/enums';
import { HttpFetchDto } from 'src/common/http';

export class MessageDto {
  id: string;
  conversation_id: string;
  inputs: Record<string, unknown>;
  query: string;
  answer: string;
  message_files: unknown[];
  feedback: unknown;
  retriever_resources: unknown[];
  created_at: number;
  status: string;
  error: unknown;
}

export class GetConversationHistoryMessagesDifyQueryDto {
  @IsString()
  @IsNotEmpty()
  conversation_id: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page: number;
}

export class GetConversationHistoryMessagesDifyParamsDto {
  app_id: string;
}

export class GetConversationHistoryMessagesDifyInputDto {
  query: GetConversationHistoryMessagesDifyQueryDto;
  params: GetConversationHistoryMessagesDifyParamsDto;
  token: string;
}

export class GetConversationHistoryMessagesDifyResponseDto {
  @Expose()
  page: number;
  @Expose()
  limit: number;
  @Expose()
  has_more: boolean;
  @Expose()
  total: number;
  @Expose()
  @Type(() => MessageDto)
  data: MessageDto[];
}

export class GetConversationHistoryMessagesDifyDto extends HttpFetchDto {
  public static url = 'v1/codelight/apps/:app_id/chat-messages';
  public method = HttpMethod.GET;
  public url = GetConversationHistoryMessagesDifyDto.url;
  public bodyDto = undefined;
  public responseDto: GetConversationHistoryMessagesDifyResponseDto;

  constructor(
    public queryDto: GetConversationHistoryMessagesDifyQueryDto,
    public paramsDto: GetConversationHistoryMessagesDifyParamsDto,
  ) {
    super();
  }
}
