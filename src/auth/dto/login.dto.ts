import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

/**
 * Data Transfer Object (DTO) for user login.
 * Validates and structures the data required for authenticating a user.
 */
export class LoginDto {
  /** Email address of the user. Must be a valid email format and cannot be empty. */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /** Password for the user account. Must be at least 8 characters long and cannot be empty. */
  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  /** Password for the user account. Must be at least 8 characters long and cannot be empty. */
  @IsString()
  @IsOptional()
  phone?: string;

  /** Password for the user account. Must be at least 8 characters long and cannot be empty. */
  @IsString()
  @IsOptional()
  otp?: string;
}

/**
 * Data Transfer Object (DTO) for accessing an account using an access token.
 * Validates and structures the data required for token-based authentication.
 */
export class AccessAccountDto {
  /** Access token for the user account. Cannot be empty. */
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
