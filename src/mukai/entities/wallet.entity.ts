import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Wallet {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique wallet identifier',
  })
  id: string;

  @ApiPropertyOptional({
    example: 'account-123',
    description: 'Holding account reference',
  })
  holding_account?: string;

  @ApiPropertyOptional({
    example: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    description: 'Wallet address (e.g., blockchain)',
  })
  address?: string;

  @ApiProperty({
    example: 'active',
    description: 'Wallet status',
    enum: ['active', 'inactive', 'suspended'],
  })
  status: string;

  @ApiProperty({
    example: 1000,
    description: 'Current balance (USD)',
  })
  balance: number;

  @ApiPropertyOptional({
    example: '2023-10-01T12:00:00Z',
    description: 'Timestamp of last transaction',
  })
  last_transaction_timestamp?: string;

  @ApiPropertyOptional({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'Parent wallet ID (for sub-wallets)',
  })
  parent_wallet_id?: string;

  @ApiPropertyOptional({
    example: 'stripe',
    description: 'Payment provider (e.g., stripe, paypal)',
  })
  provider?: string;

  @ApiProperty({
    example: 'USD',
    description: 'Default currency',
  })
  default_currency: string;

  @ApiPropertyOptional({
    example: 'biz-123',
    description: 'Associated business ID',
  })
  business_id?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the wallet is shared',
  })
  is_shared?: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether the wallet is active',
  })
  is_active: boolean;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether this is a sub-wallet',
  })
  is_sub_wallet?: boolean;

  @ApiPropertyOptional({
    example: 'profile-123',
    description: 'Associated profile ID',
  })
  profile_id?: string;

  @ApiPropertyOptional({
    example: 'coop-456',
    description: 'Associated cooperative ID',
  })
  coop_id?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Whether this is a group wallet',
  })
  is_group_wallet?: boolean;

  @ApiPropertyOptional({
    example: ['wallet-789', 'wallet-012'],
    description: 'List of child wallet IDs',
    type: [String],
  })
  children_wallets?: string[];

  @ApiPropertyOptional({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'Group ID to which the wallet is linked',
  })
  group_id?: string;
}
