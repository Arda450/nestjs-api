import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

// das ist die validation pipe, die die email und password validiert
export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
