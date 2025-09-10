import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLoanDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique ID for loan',
    required: true,
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({
    example: '2025-06-24 10:40:38.582469+02',
    description: 'Date of loan creation',
    required: true,
  })
  @IsString()
  @IsOptional()
  created_at?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Wallet ID for loan applicant',
    required: true,
  })
  @IsString()
  @IsOptional()
  borrower_wallet_id?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Coop wallet ID for loan issuer',
    required: true,
  })
  @IsString()
  @IsOptional()
  lender_wallet_id?: string;

  @ApiProperty({
    example: 1000,
    description: 'Amount requested',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  principal_amount?: number;

  @ApiProperty({
    example: 0.02,
    description: 'Interest rate',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  interest_rate?: number;

  @ApiProperty({
    example: 120,
    description: 'Loan term in months',
    required: true,
  })
  @IsInt()
  @IsOptional()
  loan_term_months?: number;

  @ApiProperty({
    example: '2025/01/01',
    description: 'Due date for loan',
    required: true,
  })
  @IsDate()
  @IsOptional()
  due_date?: Date;

  @ApiProperty({
    example: 'active',
    description: 'Loan status',
    required: true,
  })
  @IsString()
  @IsOptional()
  enum: ['pending', 'active', 'paid', 'defaulted', 'cancelled'];
  status?: string;

  @ApiProperty({
    example: 700,
    description: 'Remaining loan balance',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  remaining_balance?: number;

  @ApiProperty({
    example: '2025/02/03',
    description: 'Date of previous loan instalment',
    required: true,
  })
  @IsDate()
  @IsOptional()
  last_payment_date?: Date;

  @ApiProperty({
    example: '2025/03/03',
    description: 'Date of next loan instalment',
    required: true,
  })
  @IsDate()
  @IsOptional()
  next_payment_date?: Date;

  @ApiProperty({
    example: 50,
    description: 'Instalment amount',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  payment_amount?: number;

  @ApiProperty({
    example: 'Mortgage',
    description: 'Purpose for loan',
    required: true,
  })
  @IsString()
  @IsOptional()
  loan_purpose?: string;

  @ApiProperty({
    example: 'Tractor',
    description: 'Collateral',
    required: true,
  })
  @IsString()
  @IsOptional()
  collateral_description?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Profile ID of loan applicant',
    required: true,
  })
  @IsString()
  @IsOptional()
  profile_id?: string;

  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'Lender coop ID',
  })
  @IsString()
  @IsOptional()
  cooperative_id?: string;

  @ApiProperty({
    example: '2023-10-01T00:00:00Z',
    description: 'Loan update timestamp',
  })
  @IsString()
  @IsOptional()
  updated_at?: string;

  @ApiProperty({
    example: true,
    description: 'Indicates if members have voted for/against the loan',
  })
  @IsString()
  @IsOptional()
  has_received_vote?: boolean;

  @ApiProperty({
    example: true,
    description: 'Indicates if the loan was approved',
  })
  @IsString()
  @IsOptional()
  is_approved?: boolean;
}
