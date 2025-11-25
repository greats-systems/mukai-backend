import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
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
    example: 'password123',
    minLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiPropertyOptional({
    description: 'Phone number for the user account (optional)',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;

  /*
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

@ApiTags('Authentication')
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

@ApiTags('OTP')
/**
 * Data Transfer Object (DTO) for OTP verification
 */
export class OtpDto {
  @ApiProperty({
    description: 'Phone number associated with the OTP',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'One-time password code',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({
    description: 'OTP request identifier',
    example: 'verify_login',
  })
  @IsString()
  @IsNotEmpty()
  request: string;
}

@ApiTags('Security')
/**
 * Data Transfer Object (DTO) for security questions
 */
export class SecurityQuestionsDto {
  @ApiProperty({
    description: 'User profile identifier',
    example: '3cc4101d-7120-4765-8161-fa457d211c97',
  })
  @IsString()
  @IsNotEmpty()
  profile: string;

  @ApiProperty({
    description: 'Answer to primary school security question',
    example: 'Greenwood Elementary',
  })
  @IsString()
  @IsNotEmpty()
  primary_school: string;

  @ApiProperty({
    description: 'Answer to maternal grandfather security question',
    example: 'John Smith',
  })
  @IsString()
  @IsNotEmpty()
  maternal_grandfather: string;

  @ApiProperty({
    description: 'Answer to lucky number security question',
    example: '7',
  })
  @IsString()
  @IsNotEmpty()
  lucky_number: string;
}

@ApiTags('Profiles')
/**
 * Data Transfer Object (DTO) for profile search with filters
 */
export class ProfilesLikeDto {
  @ApiProperty({
    description: 'User ID to exclude from results',
    example: '3cc4101d-7120-4765-8161-fa457d211c97',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'First name to search for',
    example: 'John',
    required: false,
  })
  @IsString()
  @IsOptional()
  first_name?: string;

  @ApiProperty({
    description: 'Last name to search for',
    example: 'Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  last_name?: string;

  @ApiProperty({
    description: 'Phone number to search for',
    example: '+1234567890',
    required: false,
  })
  @IsString()
  @IsOptional()
  phone?: string;
}

export class ProfileSuggestionsDto {
  @ApiProperty({
    description: 'User ID to exclude from results',
    example: '3cc4101d-7120-4765-8161-fa457d211c97',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'Search term',
    example: 'Jo',
    required: false,
  })
  @IsString()
  @IsOptional()
  search_term?: string;
}
