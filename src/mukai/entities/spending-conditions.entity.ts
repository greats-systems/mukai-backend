import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SpendingConditions {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier',
  })
  id: string;

  @ApiProperty({
    example: '2023-10-01T00:00:00Z',
    description: 'Creation timestamp',
  })
  created_at: string;

  @ApiProperty({
    example: 1000,
    description: 'Target spending amount (USD)',
  })
  target_amount: number;

  @ApiProperty({
    example: '2023-12-31T00:00:00Z',
    description: 'Target completion date',
  })
  target_date: Date;

  @ApiPropertyOptional({
    example: 'Q1 Marketing Budget',
    description: 'Milestone description',
  })
  milestone?: string;

  @ApiPropertyOptional({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'Associated wallet ID',
  })
  wallet_id?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether to auto-authorize transactions',
  })
  authorize_transaction?: boolean;
}
