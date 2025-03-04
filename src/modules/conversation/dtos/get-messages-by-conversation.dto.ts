import { ApiProperty } from '@nestjs/swagger';

import { Expose, Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class GetConversationHistoryMessagesQueryDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 10 })
  @Transform(({ value }) => parseInt(value as string))
  @Min(1)
  @Max(50)
  take: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 1 })
  @Transform(({ value }) => parseInt(value as string))
  @Min(1)
  page: number;
}

export class GetConversationHistoryMessagesInputDto {
  query: GetConversationHistoryMessagesQueryDto;
}

export class GetConversationHistoryMessagesResponseDto {
  @Expose() id: string;
  @Expose() query: string;
  @Expose() answer: string;
  @Expose() message_files: unknown[];
  @Expose() created_at: number;
}
