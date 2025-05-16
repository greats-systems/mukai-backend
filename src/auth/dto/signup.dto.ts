// signup.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
    message: 'Password must contain at least one lowercase, uppercase, and number'
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  account_type: string;


  @IsString()
  push_token: string;

  @IsString()
  national_id_url: string;


  @IsString()
  passport_url: string;

  @IsString()
  avatar: string;
}