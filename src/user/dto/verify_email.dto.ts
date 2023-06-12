import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  otp: number;
}
