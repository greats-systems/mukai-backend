import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn, IsEmail } from 'class-validator';

export class CreateWalletRequest {
  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Mobile number of the user',
    example: '263770770770',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  mobile: string;

  @ApiProperty({
    description: 'Date of birth in YYYY-MM-DD format',
    example: '1990-01-15',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  dateOfBirth: string;

  @ApiProperty({
    description: 'Government issued identification number',
    example: 'A1234567',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  idNumber: string;

  @ApiProperty({
    description: 'Gender of the user',
    enum: ['MALE', 'FEMALE'],
    example: 'MALE',
    required: true,
  })
  @IsString()
  @IsIn(['MALE', 'FEMALE'])
  @IsNotEmpty()
  gender: string;

  @ApiProperty({
    description: 'Source of the registration',
    example: 'MOBILE_APP',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  source: string;
}

export class LoginRequest {
  @ApiProperty({
    description: 'Username or email address',
    example: 'john.doe@example.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Password for authentication',
    example: 'securePassword123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SetPasswordRequest {
  @ApiProperty({
    description: 'Username or email address',
    example: 'john.doe@example.com',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'New password to set',
    example: 'newSecurePassword456',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'One-time password for verification',
    example: '123456',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  otp: string;
}
