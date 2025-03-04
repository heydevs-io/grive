import { IsNotEmpty, IsString } from 'class-validator';
import { HttpMethod } from 'src/common/enums';
import { HttpFetchDto } from 'src/common/http';

import { InternalApiDifyAiHeaderDto } from './internal-api-base.dto';

export class LoginWithoutPasswordDifyAiBodyDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class LoginWithoutPasswordDifyAiResponseDto {
  result: string;
  data: string; // token
}

export class PostLoginWithoutPasswordDifyAiDto extends HttpFetchDto {
  public static url = 'v1/codelight/login-without-password';
  public method = HttpMethod.POST;
  public url = PostLoginWithoutPasswordDifyAiDto.url;
  public paramsDto = undefined;
  public queryDto = undefined;
  public responseDto: LoginWithoutPasswordDifyAiResponseDto;
  public headers: InternalApiDifyAiHeaderDto;

  constructor(public bodyDto: LoginWithoutPasswordDifyAiBodyDto) {
    super();
  }
}
