import { ApiProperty } from '@nestjs/swagger';

export class Agreement {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the agreement',
  })
  id: string;

  @ApiProperty({
    example: 'contract-address-xyz',
    description: 'Smart contract handling the agreement',
  })
  handling_smart_contract: string;

  @ApiProperty({
    example: true,
    description: 'Whether collateral is required for the agreement',
  })
  is_collateral_required: boolean;

  @ApiProperty({
    example: 'account-address-1',
    description: 'Account requesting the agreement',
  })
  requesting_account: string;

  @ApiProperty({
    example: 'account-address-2',
    description: 'Account offering the agreement',
  })
  offering_account: string;

  @ApiProperty({
    example: 'asset-id-xyz',
    description: 'ID of the collateral asset',
  })
  collateral_asset_id: string;

  @ApiProperty({
    example: '2023-12-31T23:59:59Z',
    description: 'Due date for payment',
  })
  payment_due: string;

  @ApiProperty({
    example: 'NET30',
    description: 'Payment terms for the agreement',
  })
  payment_terms: string;

  @ApiProperty({
    example: '1000.50',
    description: 'Amount involved in the agreement',
  })
  amount: string;

  @ApiProperty({
    example: 'wallet-id-xyz',
    description: 'Wallet handling payments',
  })
  payments_handling_wallet_id: string;

  @ApiProperty({
    example: 'handler-id-xyz',
    description: 'ID of the collateral asset handler',
  })
  collateral_asset_handler_id: string;

  @ApiProperty({
    example: '50.00',
    description: 'Fee for the collateral asset handler',
  })
  collateral_asset_handler_fee: string;
}
