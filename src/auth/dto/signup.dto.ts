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
  name: string;
}