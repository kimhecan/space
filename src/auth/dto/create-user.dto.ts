import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Gender } from 'src/user/type';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsString()
  profileImage: string;
}
