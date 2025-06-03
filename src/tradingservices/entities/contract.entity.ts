import { ApiProperty } from '@nestjs/swagger';

/**
 * Contract Entity representing a producer's contract in the system
 */
export class Contract {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the contract',
    format: 'uuid',
  })
  contract_id: string;

  @ApiProperty({
    example: '987e6543-e21b-12d3-a456-426614170000',
    description: 'ID of the producer who created the contract',
    format: 'uuid',
  })
  producer_id: string;

  @ApiProperty({
    example: 'Organic Wheat Supply Agreement',
    description: 'Title of the contract',
    maxLength: 100,
  })
  title: string;

  @ApiProperty({
    example: 'Annual supply contract for organic wheat',
    description: 'Detailed description of the contract terms',
    required: false,
  })
  description: string;

  @ApiProperty({
    example: 5000,
    description: 'Total quantity in kilograms',
    minimum: 1,
  })
  quantity_kg: number;

  @ApiProperty({
    example: 25000,
    description: 'Monetary value of the contract',
    minimum: 0,
  })
  value: number;
}
