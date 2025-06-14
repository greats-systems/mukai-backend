import { IsDate, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLoanDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  created_at?: string;

  @IsString()
  @IsOptional()
  borrower_wallet_id?: string;

  @IsString()
  @IsOptional()
  lender_wallet_id?: string;

  @IsNumber()
  @IsOptional()
  principal_amount?: number;

  @IsNumber()
  @IsOptional()
  interest_rate?: number;

  @IsInt()
  @IsOptional()
  loan_term_days?: number;

  @IsDate()
  @IsOptional()
  due_date?: Date;

  @IsString()
  @IsOptional()
  enum: ['pending', 'active', 'paid', 'defaulted', 'cancelled'];
  status?: string;

  @IsNumber()
  @IsOptional()
  remaining_balance?: number;

  @IsDate()
  @IsOptional()
  last_payment_date?: Date;

  @IsDate()
  @IsOptional()
  next_payment_date?: Date;

  @IsNumber()
  @IsOptional()
  payment_amount?: number;

  @IsString()
  @IsOptional()
  loan_purpose?: string;

  @IsString()
  @IsOptional()
  collateral_description?: string;
}
