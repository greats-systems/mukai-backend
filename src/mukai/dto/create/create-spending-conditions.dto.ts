import { IsOptional, IsString } from 'class-validator';

export class CreateSpendingConditionsDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  created_at?: string;

  @IsString()
  @IsOptional()
  target_amount?: number;

  @IsString()
  @IsOptional()
  target_date?: Date;

  @IsString()
  @IsOptional()
  milestone?: string;

  @IsString()
  @IsOptional()
  wallet_id?: string;

  @IsString()
  @IsOptional()
  authorize_transaction?: boolean;
}
