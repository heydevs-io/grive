import { ApiProperty } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { HttpMethod } from 'src/common/enums';
import { HttpFetchDto } from 'src/common/http';

export class MediaUrlDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  transfer_method: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsOptional()
  upload_file_id?: string;
}

export class ChatMessageInputsDto {}

export class ChatMessageRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The response mode to use for the chat message',
    example: 'streaming',
  })
  response_mode: string;

  conversation_id?: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    description: 'The files to use for the chat message',
    example: [],
  })
  files?: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The query to use for the chat message',
    example: 'generate comment',
  })
  query: string;

  @ValidateNested()
  @Type(() => ChatMessageInputsDto)
  @ApiProperty({})
  inputs: ChatMessageInputsDto;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'The parent message ID to use for the chat message',
    example: null,
  })
  parent_message_id?: string;
}

export class ChatMessageResponseDto {
  answer: string;
  statusCode: number;
  status: boolean;
  message: string;
}

export class PostChatMessageDto extends HttpFetchDto {
  public static url = 'api/chat-messages';
  public method = HttpMethod.POST;
  public url = PostChatMessageDto.url;
  public paramsDto = undefined;
  public queryDto = undefined;
  public responseDto: ChatMessageResponseDto;

  constructor(public bodyDto: ChatMessageRequestDto) {
    super();
  }
}
