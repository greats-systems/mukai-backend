import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateWalletTransactionDto {
  @ApiProperty({
    example: '0789012345',
    description: 'Initiator mobile number',
  })
  @IsString()
  subscriber_mobile: string;

  @ApiProperty({
    example: 'ZB Bank',
    description: 'Initiator bank',
  })
  @IsString()
  bank: string;

  @ApiProperty({
    example: '4113 000784124 405',
    description: 'Initiator bank account',
  })
  @IsString()
  bank_account: string;

  @ApiProperty({
    example: 12.78,
    description: 'Transaction amount',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 'USD',
    description: 'Transaction currency ',
    enum: ['USD', 'ZiG'],
  })
  @IsString()
  currency: string;

  @ApiProperty({
    example: 'USSD',
    description: 'Transaction channel',
  })
  @IsString()
  channel: string;

  @ApiProperty({
    example: 'Success',
    description: 'Transaction response',
  })
  @IsString()
  message_type: string;

  @ApiProperty({
    example: 'Transaction ID',
    description: 'Unique identifier for transaction',
  })
  @IsString()
  transaction_id: string;
}
