import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Loan {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique loan identifier',
  })
  id?: string;

  @ApiProperty({
    example: '2023-10-01T00:00:00Z',
    description: 'Loan creation timestamp',
  })
  created_at?: string;

  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'Borrower wallet ID',
  })
  borrower_wallet_id?: string;

  @ApiProperty({
    example: '567e1234-e89b-43d2-b456-426614174000',
    description: 'Lender wallet ID',
  })
  lender_wallet_id?: string;

  @ApiProperty({
    example: 1000,
    description: 'Principal loan amount (USD)',
  })
  principal_amount: number;

  @ApiProperty({
    example: 5.5,
    description: 'Annual interest rate (%)',
  })
  interest_rate?: number;

  @ApiProperty({
    example: 30,
    description: 'Loan term in months',
  })
  loan_term_months?: number;

  @ApiProperty({
    example: '2023-11-01T00:00:00Z',
    description: 'Due date for repayment',
  })
  due_date?: Date;

  @ApiProperty({
    example: 'active',
    description: 'Loan status',
    enum: ['pending', 'active', 'paid', 'defaulted'],
  })
  status?: string;

  @ApiPropertyOptional({
    example: 500,
    description: 'Remaining balance (USD)',
  })
  remaining_balance?: number;

  @ApiPropertyOptional({
    example: '2023-10-15T00:00:00Z',
    description: 'Last payment timestamp',
  })
  last_payment_date?: Date;

  @ApiPropertyOptional({
    example: '2023-10-20T00:00:00Z',
    description: 'Next payment due date',
  })
  next_payment_date?: Date;

  @ApiPropertyOptional({
    example: 100,
    description: 'Fixed payment amount (USD)',
  })
  payment_amount?: number;

  @ApiPropertyOptional({
    example: 'Farm equipment purchase',
    description: 'Purpose of the loan',
  })
  loan_purpose?: string;

  @ApiPropertyOptional({
    example: 'Tractor as collateral',
    description: 'Description of collateral',
  })
  collateral_description?: string;

  @ApiPropertyOptional({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'Borrower profile ID',
  })
  profile_id?: string;

  @ApiPropertyOptional({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'Lender coop ID',
  })
  cooperative_id?: string;
}
