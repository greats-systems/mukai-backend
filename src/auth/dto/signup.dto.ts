// signup.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * Data Transfer Object (DTO) for user signup.
 * Validates and structures the data required for creating a new user account.
 */
export class SignupDto {
  /*
  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the user',
    required: true,
  })
  @IsString()
  */
  id: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email address of the user',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '263770888000',
    description: 'Phone number of the user',
    required: true,
  })
  @IsString()
  @MinLength(2)
  phone: string;

  /*
  @ApiProperty({
    example: '26371800800',
    description: 'Coop phone number of the user (for which they are the admin)',
    required: true,
  })
  @IsString()
  @MinLength(2)
  */
  coop_phone: string;

  @ApiProperty({
    example: 'John',
    description: 'First name of the user',
    required: true,
  })
  @IsString()
  @MinLength(2)
  first_name: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the user',
    required: true,
  })
  @IsString()
  @MinLength(2)
  last_name: string;

  @ApiProperty({
    example: 'individual',
    description: 'Type of account (e.g., individual, business)',
    required: true,
  })
  @IsString()
  @MinLength(2)
  account_type: string;

  @ApiProperty({
    example: 'secretary',
    description: 'User role in a cooperative (chairman, secretary, financier)',
    required: true,
  })
  @IsString()
  @MinLength(2)
  role: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Date of birth of the user',
    required: true,
  })
  @IsString()
  dob: string;

  @ApiProperty({
    example: 'male',
    description: 'Gender of the user',
    required: true,
  })
  @IsString()
  gender: string;

  // @ApiProperty({
  //   example: '123e4567-e89b-12d3-a456-426614174000',
  //   description: 'Wallet ID associated with the user',
  //   required: true,
  // })
  // @IsString()
  // wallet_id: string;

  // @ApiPropertyOptional({
  //   example: '123e4567-e89b-12d3-a456-426614174000',
  //   description: 'Cooperative ID associated with the user',
  // })
  // @IsString()
  // cooperative_id: string;

  // @ApiPropertyOptional({
  //   example: '123e4567-e89b-12d3-a456-426614174000',
  //   description: 'Business ID associated with the user',
  // })
  // @IsString()
  business_id: string;

  // @ApiPropertyOptional({
  //   example: 'member',
  //   description: 'Affiliations of the user',
  // })
  // @IsString()
  // affiliations: string;

  // @ApiPropertyOptional({
  //   example: '123e4567-e89b-12d3-a456-426614174000',
  //   description: 'Cooperative account ID associated with the user',
  // })
  // @IsString()
  coop_account_id: string;

  // @ApiPropertyOptional({
  //   example: '123e4567-e89b-12d3-a456-426614174000',
  //   description: 'Cooperative account ID associated with the user',
  // })
  // @IsString()
  cooperative_id: string;

  // @ApiPropertyOptional({
  //   example: 'abc123',
  //   description: 'Push notification token for the user',
  // })
  // @IsString()
  push_token: string;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    description: "URL to the user's avatar image",
  })
  @IsString()
  avatar: string;

  @ApiPropertyOptional({
    example: 'https://example.com/national_id.jpg',
    description: "URL to the user's national ID document",
  })
  @IsString()
  national_id_url: string;

  @ApiPropertyOptional({
    example: 'https://example.com/passport.jpg',
    description: "URL to the user's passport document",
  })
  @IsString()
  passport_url: string;

  @ApiProperty({
    example: 'Password123!',
    description:
      'Password for the user account. Must be at least 8 characters long.',
    required: true,
  })
  @IsString()
  @MinLength(8)
  // @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
  //   message:
  //     'Password must contain at least one lowercase, uppercase, and number',
  // })
  password: string;
  @ApiPropertyOptional({
    example: 'Zimbabwe',
    description: 'Country where the user resides',
  })
  @IsString()
  country: string;

  @ApiPropertyOptional({
    example: 'Harare',
    description: 'City where the user resides',
  })
  @IsString()
  city: string;

  @ApiPropertyOptional({
    example: '2027999J23',
    description: 'National ID number of the user',
  })
  @IsString()
  national_id_number: string;

  @ApiPropertyOptional({
    example: '200-01-01',
    description: 'Date of birth of the user',
  })
  @IsString()
  date_of_birth: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indicates if the user has been invited to join a coop',
  })
  @IsString()
  is_invited: boolean;
}
