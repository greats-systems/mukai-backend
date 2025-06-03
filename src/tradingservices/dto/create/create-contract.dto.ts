import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

/**
 * Data Transfer Object for creating a new contract
 */
export class CreateContractDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID of the producer creating the contract',
    format: 'uuid',
  })
  @IsString()
  @IsNotEmpty()
  producer_id: string;

  @ApiProperty({
    example: 'Organic Wheat Supply Agreement 2023',
    description: 'Title of the contract',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Annual contract for supply of 5000kg organic wheat',
    description: 'Detailed description of contract terms',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 5000,
    description: 'Total quantity in kilograms',
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity_kg: number;

  @ApiProperty({
    example: 25000,
    description: 'Total monetary value of the contract',
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  value: number;
}
