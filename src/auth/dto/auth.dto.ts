import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

// das ist die validation pipe, die die email und password validiert
// fungiert als create user dto
export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
