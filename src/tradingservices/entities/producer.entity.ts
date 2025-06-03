import { ApiProperty } from '@nestjs/swagger';

export class Producer {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID of the producer',
    format: 'uuid',
  })
  producer_id: string;

  @ApiProperty({
    example: 'John',
    description: 'First name',
    maxLength: 100,
  })
  first_name: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name',
    maxLength: 100,
  })
  last_name: string;

  @ApiProperty({
    example: '123 Anywhere Street Anycity',
    description: 'Address',
    maxLength: 100,
  })
  address: string;

  @ApiProperty({
    example: '0712345678',
    description: 'Phone number',
    maxLength: 100,
  })
  phone: string;

  @ApiProperty({
    example: 'email@example.com',
    description: 'email',
    maxLength: 100,
  })
  email: string;
}
