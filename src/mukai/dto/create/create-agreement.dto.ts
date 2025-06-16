import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAgreementDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the agreement (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({
    example: 'contract-address-xyz',
    description: 'Smart contract handling the agreement (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  handling_smart_contract?: string;

  @ApiProperty({
    example: true,
    description: 'Whether collateral is required for the agreement (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  is_collateral_required?: boolean;

  @ApiProperty({
    example: 'account-address-1',
    description: 'Account requesting the agreement (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  requesting_account?: string;

  @ApiProperty({
    example: 'account-address-2',
    description: 'Account offering the agreement (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  offering_account?: string;

  @ApiProperty({
    example: 'asset-id-xyz',
    description: 'ID of the collateral asset (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  collateral_asset_id?: string;

  @ApiProperty({
    example: '2023-12-31T23:59:59Z',
    description: 'Due date for payment (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  payment_due?: string;

  @ApiProperty({
    example: 'NET30',
    description: 'Payment terms for the agreement (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  payment_terms?: string;

  @ApiProperty({
    example: '1000.50',
    description: 'Amount involved in the agreement (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  amount?: string;

  @ApiProperty({
    example: 'wallet-id-xyz',
    description: 'Wallet handling payments (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  payments_handling_wallet_id?: string;

  @ApiProperty({
    example: 'handler-id-xyz',
    description: 'ID of the collateral asset handler (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  collateral_asset_handler_id?: string;

  @ApiProperty({
    example: '50.00',
    description: 'Fee for the collateral asset handler (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  collateral_asset_handler_fee?: string;
}
