import { ApiProperty } from '@nestjs/swagger';

export class Password {
  @ApiProperty({
    example: 'user123',
    description: 'Username for subscriber',
  })
  username: string;

  @ApiProperty({
    example: '**************',
    description: 'Password for subscriber',
  })
  password: string;

  @ApiProperty({
    example: '0712345678',
    description: 'Phone number for subscriber',
  })
  otp: string;
}
