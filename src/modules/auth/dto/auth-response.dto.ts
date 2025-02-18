import { ApiProperty } from '@nestjs/swagger';

export class AuthToken {
  @ApiProperty({
    example: '123456',
  })
  accessToken: string;

  @ApiProperty({
    example: '123456',
  })
  refreshToken?: string;
}
