import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Transaction {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique transaction identifier',
  })
  id: string;

  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'Associated account ID',
  })
  account_id: string;

  @ApiPropertyOptional({
    example: 5,
    description: 'Transaction fee (USD)',
  })
  transaction_cost?: number;

  @ApiProperty({
    example: 'transfer',
    description: 'Type of transaction',
    enum: ['transfer', 'deposit', 'withdrawal', 'payment'],
  })
  transaction_type: string;

  @ApiPropertyOptional({
    example: 'payment',
    description: 'Transaction category (e.g., "groceries", "salary")',
  })
  category?: string;

  @ApiProperty({
    example: '2023-10-01T00:00:00Z',
    description: 'Creation timestamp',
  })
  created_date: string;

  @ApiProperty({
    example: 100,
    description: 'Transaction amount (USD)',
  })
  amount: number;

  @ApiPropertyOptional({
    example: 'Payment for October services',
    description: 'Human-readable transaction name',
  })
  name?: string;

  @ApiPropertyOptional({
    example: 'user-123',
    description: 'Owner/initiator of the transaction',
  })
  owner?: string;

  @ApiPropertyOptional({
    example: 'Invoice #12345',
    description: 'Additional context or reference',
  })
  narrative?: string;

  @ApiPropertyOptional({
    example: 'abc123',
    description: 'Security salt for hashing',
  })
  salt?: string;

  @ApiPropertyOptional({
    example: '567e1234-e89b-43d2-b456-426614174000',
    description: 'Receiving wallet ID (for transfers)',
  })
  receiving_wallet?: string;

  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'Sending wallet ID',
  })
  sending_wallet: string;
}
