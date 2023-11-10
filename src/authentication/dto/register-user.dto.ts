import { IsString, Length } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @Length(5, 10)
  name: string;

  @IsString()
  @Length(5, 10)
  email: string;

  @IsString()
  @Length(8, 12)
  password: string;
}
