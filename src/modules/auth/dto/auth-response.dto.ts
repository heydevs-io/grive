import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class AuthToken {
  @ApiProperty({
    example: '123456',
  })
  @Expose()
  accessToken: string;

  @ApiProperty({
    example: '123456',
  })
  @Expose()
  refreshToken?: string;

  @ApiProperty({
    example: false,
  })
  @Expose()
  onboardingComplete?: boolean;
}
