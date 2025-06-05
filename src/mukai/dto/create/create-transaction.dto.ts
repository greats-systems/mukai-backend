import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  account_id: string;

  @IsNumber()
  @IsOptional()
  transaction_cost: number;

  @IsString()
  @IsOptional()
  transaction_type: string;

  @IsString()
  @IsOptional()
  category: string;

  @IsString()
  @IsOptional()
  created_date: string;

  @IsString()
  @IsOptional()
  amount: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  owner: string;

  @IsString()
  @IsOptional()
  narrative: string;

  @IsString()
  @IsOptional()
  salt: string;

  @IsString()
  @IsOptional()
  receiving_wallet: string;

  @IsString()
  @IsOptional()
  sending_wallet: string;
}
