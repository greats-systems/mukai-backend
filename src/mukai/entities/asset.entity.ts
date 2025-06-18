import { ApiProperty } from '@nestjs/swagger';

export class Asset {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the asset',
  })
  id: string;

  @ApiProperty({
    example: 'account-address-xyz',
    description: 'Account holding the asset',
  })
  holding_account: string;

  @ApiProperty({
    example: 'USD',
    description: 'Currency used for valuation',
  })
  valuation_currency: string;

  @ApiProperty({
    example: 1000.5,
    description: 'Fiat value of the asset',
  })
  fiat_value: number;

  @ApiProperty({
    example: 10.5,
    description: 'Token value of the asset',
  })
  token_value: number;

  @ApiProperty({
    example: 'board-id-xyz',
    description: 'Governing board for the asset',
  })
  governing_board: string;

  @ApiProperty({
    example: '2023-12-31T23:59:59Z',
    description: 'Timestamp of last transaction',
  })
  last_transaction_timestamp: string;

  @ApiProperty({
    example: 'issuer-id-xyz',
    description: 'ID of verifiable certificate issuer',
  })
  verifiable_certificate_issuer_id: string;

  @ApiProperty({
    example: 'document-id-xyz',
    description: 'Legal documents associated with the asset',
  })
  legal_documents: string;

  @ApiProperty({
    example: true,
    description: 'Whether the asset has a verifiable certificate',
  })
  has_verifiable_certificate: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether the asset has been valuated',
  })
  is_valuated: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether the asset has been minted',
  })
  is_minted: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether the asset is shared',
  })
  is_shared: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether the asset is active',
  })
  is_active: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether the asset has associated documents',
  })
  has_document: boolean;

  @ApiProperty({
    example: 'active',
    description: 'Current status of the asset',
  })
  status: string;

  @ApiProperty({
    example: 'profile-id-xyz',
    description: 'Associated profile ID',
  })
  profile_id: string;
}
