import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsArray,
  IsNumber,
} from 'class-validator';
import { UUID } from 'crypto';

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

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Wallet ID',
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({
    example: 'account_123',
    description: 'Holding account identifier',
  })
  @IsString()
  @IsOptional()
  holding_account?: string;

  @ApiPropertyOptional({
    example: '0x123abc...',
    description: 'Wallet address',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    example: 'active',
    description: 'Wallet status',
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    example: 1000,
    description: 'Wallet balance',
  })
  @IsNumber()
  @IsOptional()
  balance?: number;

  @ApiPropertyOptional({
    example: 1000,
    description: 'ZWG Wallet balance',
  })
  @IsNumber()
  @IsOptional()
  balance_zwg?: number;

  @ApiPropertyOptional({
    example: '2023-10-01T12:00:00Z',
    description: 'Timestamp of the last transaction',
  })
  @IsString()
  @IsOptional()
  last_transaction_timestamp?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Parent wallet ID',
  })
  @IsString()
  @IsOptional()
  parent_wallet_id?: string;

  @ApiPropertyOptional({
    example: 'provider_name',
    description: 'Wallet provider',
  })
  @IsString()
  @IsOptional()
  provider?: string;

  @ApiPropertyOptional({
    example: '+263771234567',
    description: 'Individual wallet phone number',
  })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({
    example: '+263712987654',
    description: 'Cooperative wallet phone number',
  })
  @IsString()
  @IsOptional()
  coop_phone?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Associated business ID',
  })
  @IsString()
  @IsOptional()
  business_id?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the wallet is active',
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether the wallet is a sub-wallet',
  })
  @IsBoolean()
  @IsOptional()
  is_sub_wallet?: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether the wallet is a group wallet',
  })
  @IsBoolean()
  @IsOptional()
  is_group_wallet?: boolean;

  @ApiPropertyOptional({
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001',
    ],
    description: 'List of child wallet IDs',
  })
  @IsString()
  @IsArray()
  @IsOptional()
  children_wallets?: string[];

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Group ID',
  })
  @IsString()
  @IsOptional()
  group_id?: UUID;
}
