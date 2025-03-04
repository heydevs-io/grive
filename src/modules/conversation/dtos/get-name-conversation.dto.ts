import { ApiProperty } from '@nestjs/swagger';

import { IsBoolean } from 'class-validator';
import { HttpMethod } from 'src/common/enums';
import { HttpFetchDto } from 'src/common/http';

export class GetNameConversationDifyRequestDto {
  @ApiProperty({
    description: 'Whether to auto generate the conversation name',
    example: true,
  })
  @IsBoolean()
  auto_generate: boolean;
}

export class GetNameConversationDifyParamsDto {
  @ApiProperty({
    description: 'The ID of the conversation',
    example: '123',
  })
  conversation_id: string;
}

export class GetNameConversationDifyResponseDto {
  @ApiProperty({
    description: 'The name of the conversation',
    example: 'My Conversation',
  })
  name: string;
}

export class GetNameConversationDifyDto extends HttpFetchDto {
  public static url = 'api/conversations/:conversation_id/name';
  public method = HttpMethod.POST;
  public url = GetNameConversationDifyDto.url;
  public queryDto = undefined;
  public responseDto: GetNameConversationDifyResponseDto;

  constructor(
    public bodyDto: GetNameConversationDifyRequestDto,
    public paramsDto: GetNameConversationDifyParamsDto,
  ) {
    super();
  }
}
