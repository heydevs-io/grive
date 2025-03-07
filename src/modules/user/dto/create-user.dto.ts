import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;
}
