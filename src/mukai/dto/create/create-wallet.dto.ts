import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class CreateWalletDto {
  @ApiProperty({
    example: 'USD',
    description: 'Default currency',
    required: true,
  })
  @IsString()
  @IsOptional()
  default_currency?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Associated profile ID',
  })
  @IsOptional()
  @IsUUID()
  profile_id?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Associated cooperative ID',
  })
  @IsOptional()
  @IsUUID()
  coop_id?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether wallet is shared',
  })
  @IsOptional()
  @IsBoolean()
  is_shared?: boolean;

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
  business_id?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @IsBoolean()
  @IsOptional()
  is_sub_wallet?: boolean;

  @IsBoolean()
  @IsOptional()
  is_group_wallet?: boolean;

  @IsString()
  @IsArray()
  @IsOptional()
  children_wallets?: string[];
}
