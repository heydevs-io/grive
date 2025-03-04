import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class UpsertConversationDto {
  @ApiProperty({
    example: 'conv_123456',
    description: 'The Dify conversation ID',
  })
  @IsString()
  @IsNotEmpty()
  difyConversationId: string;
}
