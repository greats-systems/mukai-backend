import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateAssetDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  holding_account?: string;

  @IsString()
  @IsOptional()
  valuation_currency?: string;

  @IsNumber()
  @IsOptional()
  fiat_value?: number;

  @IsNumber()
  @IsOptional()
  token_value?: number;

  @IsString()
  @IsOptional()
  governing_board?: string;

  @IsString()
  @IsOptional()
  last_transaction_timestamp?: string;

  @IsString()
  @IsOptional()
  verifiable_certificate_issuer_id?: string;

  @IsString()
  @IsOptional()
  legal_documents?: string;

  @IsBoolean()
  @IsOptional()
  has_verifiable_certificate?: boolean;

  @IsBoolean()
  @IsOptional()
  is_valuated?: boolean;

  @IsBoolean()
  @IsOptional()
  is_minted?: boolean;

  @IsBoolean()
  @IsOptional()
  is_shared?: boolean;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsBoolean()
  @IsOptional()
  has_document?: boolean;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  profile_id?: string;
}
