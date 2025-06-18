import { ApiProperty } from '@nestjs/swagger';

export class WalletTransaction {
  @ApiProperty({
    example: '0789012345',
    description: 'Initiator mobile number',
  })
  subscriber_mobile: string;

  @ApiProperty({
    example: 'ZB Bank',
    description: 'Initiator bank',
  })
  bank: string;

  @ApiProperty({
    example: '4113 000784124 405',
    description: 'Initiator bank account',
  })
  bank_account: string;

  @ApiProperty({
    example: 12.78,
    description: 'Transaction amount',
  })
  amount: number;

  @ApiProperty({
    example: 'USD',
    description: 'Transaction currency ',
    enum: ['USD', 'ZiG'],
  })
  currency: string;

  @ApiProperty({
    example: 'USSD',
    description: 'Transaction channel',
  })
  channel: string;

  @ApiProperty({
    example: 'Success',
    description: 'Transaction response',
  })
  message_type: string;

  @ApiProperty({
    example: 'Transaction ID',
    description: 'Unique identifier for transaction',
  })
  transaction_id: string;
}
