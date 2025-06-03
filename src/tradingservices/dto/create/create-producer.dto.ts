import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProducerDto {
  @ApiProperty({
    example: 'John',
    description: 'First name',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ApiProperty({
    example: '123 Anywhere Street Anycity',
    description: 'Address',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: '0712345678',
    description: 'Phone number',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    example: 'email@example.com',
    description: 'Email',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  email: string;
}
