import { ApiProperty } from '@nestjs/swagger';

export class Subscriber {
  @ApiProperty({
    example: 'John',
    description: 'First name for subscriber',
  })
  first_name: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name for subscriber',
  })
  last_name: string;

  @ApiProperty({
    example: '0712345678',
    description: 'Phone number for subscriber',
  })
  mobile: string;

  @ApiProperty({
    example: '2000-01-01',
    description: 'Subscriber date of birth (YYYY-MM-DD)',
  })
  date_of_birth: Date;

  @ApiProperty({
    example: '55 5555555 H 35',
    description: 'National ID ',
  })
  id_number: string;

  @ApiProperty({
    example: 'Female',
    description: 'Subscriber gender',
  })
  // enum: ['Male', 'Female'];
  gender: string;
}
