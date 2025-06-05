import { ApiProperty } from '@nestjs/swagger';

/**
 * Represents a bid on a contract in the system
 */
export class ContractBid {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the bid',
    format: 'uuid',
  })
  bid_id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the contract being bid on',
    format: 'uuid',
  })
  contract_id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the provider making the bid',
    format: 'uuid',
    required: false,
  })
  provider_id?: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Date when the bid was opened',
    format: 'date-time',
  })
  opening_date: string;

  @ApiProperty({
    example: 'pending',
    description: 'Current status of the bid',
    enum: ['pending', 'open', 'closed', 'awarded', 'rejected'],
  })
  status: string;

  @ApiProperty({
    example: '2023-01-15T00:00:00Z',
    description: 'Date when the bid was closed',
    format: 'date-time',
    required: false,
  })
  closing_date?: string;

  @ApiProperty({
    example: '2023-01-20T00:00:00Z',
    description: 'Date when the bid was awarded',
    format: 'date-time',
    required: false,
  })
  award_date?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of provider who was awarded the bid',
    format: 'uuid',
    required: false,
  })
  awarded_to?: string;
}
