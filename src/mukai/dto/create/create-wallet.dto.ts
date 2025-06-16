import { IsString, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateWalletDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  holding_account?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  balance?: number;

  @IsString()
  @IsOptional()
  last_transaction_timestamp?: string;

  @IsString()
  @IsOptional()
  parent_wallet_id?: string;

  @IsString()
  @IsOptional()
  provider?: string;

  @IsString()
  @IsOptional()
  default_currency?: string;

  @IsString()
  @IsOptional()
  business_id?: string;

  @IsBoolean()
  @IsOptional()
  is_shared?: boolean;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsBoolean()
  @IsOptional()
  is_sub_wallet?: boolean;

  @IsString()
  @IsOptional()
  profile_id?: string;

  @IsString()
  @IsOptional()
  coop_id?: string;

  @IsBoolean()
  @IsOptional()
  is_group_wallet?: boolean;

  @IsString()
  @IsArray()
  @IsOptional()
  children_wallets?: string[];
}
