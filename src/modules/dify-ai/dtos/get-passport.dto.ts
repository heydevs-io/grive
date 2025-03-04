import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty } from 'class-validator';
import { HttpMethod } from 'src/common/enums';
import { HttpFetchDto } from 'src/common/http';

export class GetPassportResponseDto {
  @ApiProperty({
    description: 'The access token of the user',
    example: '1234567890',
  })
  access_token: string;
}

export class GetPassportBodyDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'admin@codelight.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class GetPassportDto extends HttpFetchDto {
  public static url = 'v1/codelight/passport';
  public method = HttpMethod.POST;
  public url = GetPassportDto.url;
  public queryDto: undefined;
  public paramsDto: undefined;
  public responseDto: GetPassportResponseDto;

  constructor(public bodyDto: GetPassportBodyDto) {
    super();
  }
}
