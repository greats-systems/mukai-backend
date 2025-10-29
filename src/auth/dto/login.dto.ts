import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) for user login.
 * Validates and structures the data required for authenticating a user.
 */
export class LoginDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'igreats@gmail.com',
    format: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description:
      'Password for the user account. Must be at least 8 characters long',
    example: 'password',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  phone?: string;

  /*
  @ApiPropertyOptional({
    description: 'Phone number for the user account (optional)',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    description: 'One-time password for authentication (optional)',
    example: '123456',
    required: false,
  })
  @IsString()
  @IsOptional()
  otp?: string;
  */
}

/**
 * Data Transfer Object (DTO) for accessing an account using an access token.
 * Validates and structures the data required for token-based authentication.
 */
export class AccessAccountDto {
  @ApiProperty({
    description: 'Access token for the user account',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}

export class OtpDto {
  phone: string;
  otp: string;
  request: string;
}

export class SecurityQuestionsDto {
  profile: string;
  primary_school: string;
  maternal_grandfather: string;
  lucky_number: string;
}

export class ProfilesLikeDto {
  id: string;
  first_name: string;
  last_name: string;
}
