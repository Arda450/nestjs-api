import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  confirmPassword: string;
}
