import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsString } from 'class-validator';

export class CreateSubscriberDto {
  @ApiProperty({
    example: 'John',
    description: 'First name for subscriber',
  })
  @IsString()
  first_name: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name for subscriber',
  })
  @IsString()
  last_name: string;

  @ApiProperty({
    example: '0712345678',
    description: 'Phone number for subscriber',
  })
  @IsString()
  mobile: string;

  @ApiProperty({
    example: '2000-01-01',
    description: 'Subscriber date of birth (YYYY-MM-DD)',
  })
  @IsDate()
  date_of_birth: Date;

  @ApiProperty({
    example: '55 5555555 H 35',
    description: 'National ID ',
  })
  @IsString()
  id_number: string;

  @ApiProperty({
    example: 'Female',
    description: 'Subscriber gender',
  })
  @IsString()
  enum: ['Male', 'Female'];
  gender: string;
}
