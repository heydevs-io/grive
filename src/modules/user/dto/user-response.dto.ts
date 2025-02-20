import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserStatus } from '@enums';
import { BusinessProfileResponseDto } from '../../business-profile/dto';

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty({ example: '5e4ce015-172c-4ecb-a264-9be315de0c72' })
  id: string;

  @Expose()
  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @Expose()
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'https://www.example.com/avatar.png' })
  avatar: string;

  @Expose()
  @ApiProperty({ example: 'ACTIVE', enum: UserStatus })
  status: UserStatus;

  @Expose()
  @ApiProperty({ type: BusinessProfileResponseDto })
  businessProfile: BusinessProfileResponseDto;
}
