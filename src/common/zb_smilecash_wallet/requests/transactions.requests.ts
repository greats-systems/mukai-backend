import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class BalanceEnquiryRequest {
  @ApiProperty({
    description: 'Mobile number of the transactor',
    example: '263771234567',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  transactorMobile: string;

  @ApiProperty({
    description: 'Currency for balance enquiry',
    enum: ['ZWG', 'USD'],
    example: 'USD',
    required: true,
  })
  @IsString()
  @IsIn(['ZWG', 'USD'])
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    description: 'Channel through which the request is made',
    enum: ['USSD', 'APP', 'WEB'],
    example: 'USSD',
    required: true,
  })
  @IsString()
  @IsIn(['USSD', 'APP', 'WEB'])
  @IsNotEmpty()
  channel: string;

  @ApiProperty({
    description: 'Unique transaction identifier',
    example: 'TX123456789',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  transactionId: string;
}

export class BankToWalletTransferRequest {
  @ApiProperty({
    description: 'Wallet mobile number',
    example: '263771234567',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'Transfer amount',
    example: 100.5,
    minimum: 0.01,
    required: true,
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Currency of the transfer',
    example: 'USD',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    description: 'Channel through which the transfer is initiated',
    example: 'APP',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  channel: string;

  @ApiProperty({
    description: 'ZB Bank account number',
    example: '1234567890',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  bankAccount: string;

  @ApiProperty({
    description: 'Unique transaction identifier',
    example: 'TX123456789',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({
    description: 'Transfer narration/description',
    example: 'Salary payment',
    required: false,
  })
  @IsString()
  @IsOptional()
  narration?: string;
}

export class WalletToWalletTransferRequest {
  @ApiProperty({
    description: 'Destination wallet mobile number',
    example: '263772345678',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  receiverMobile: string;

  @ApiProperty({
    description: 'Source wallet mobile number',
    example: '263771234567',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  senderPhone: string;

  @ApiProperty({
    description: 'Transfer amount',
    example: 50.0,
    minimum: 0.01,
    required: true,
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Currency of the transfer',
    example: 'USD',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    description: 'Channel through which the transfer is initiated',
    example: 'USSD',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  channel: string;

  @ApiProperty({
    description: 'Transfer narration/description',
    example: 'Lunch money',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  narration: string;

  @ApiProperty({
    description: 'Unique transaction identifier',
    example: 'TX123456789',
    required: false,
  })
  @IsString()
  @IsOptional()
  transactionId?: string;
}

export class WalletToOwnBankTransferRequest {
  @ApiProperty({
    description: 'Subscriber mobile number',
    example: '263771234567',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  subscriberMobile: string;

  @ApiProperty({
    description: 'Bank name',
    example: 'ZB Bank',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  bank: string;

  @ApiProperty({
    description: 'Bank account number',
    example: '1234567890',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  bankAccount: string;

  @ApiProperty({
    description: 'Transfer amount',
    example: 200.0,
    minimum: 0.01,
    required: true,
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Currency of the transfer',
    example: 'USD',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    description: 'Channel through which the transfer is initiated',
    example: 'WEB',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  channel: string;

  @ApiProperty({
    description: 'Message type for the transaction',
    example: 'TRANSFER',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  messageType: string;

  @ApiProperty({
    description: 'Unique transaction identifier',
    example: 'TX123456789',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  transactionId: string;
}

export class WalletToOtherBankTransferRequest {
  @ApiProperty({
    description: 'Transactor mobile number',
    example: '263771234567',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  transactorMobile: string;

  @ApiProperty({
    description: 'Destination bank account number',
    example: '0987654321',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  destinationBankAccount: string;

  @ApiProperty({
    description: 'Transfer amount',
    example: 150.0,
    minimum: 0.01,
    required: true,
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Currency of the transfer',
    example: 'ZWG',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    description: 'Channel through which the transfer is initiated',
    example: 'APP',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  channel: string;

  @ApiProperty({
    description: 'Message type for the transaction',
    example: 'BANK_TRANSFER',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  messageType: string;

  @ApiProperty({
    description: 'Unique transaction identifier',
    example: 'TX123456789',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  transactionId: string;
}

export class PayMerchantRequest {
  @ApiProperty({
    description: 'Transactor phone number',
    example: '263771234567',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  transactorPhone: string;

  @ApiProperty({
    description: 'Merchant code',
    example: 'MERCH123',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  merchantCode: string;

  @ApiProperty({
    description: 'Payment amount',
    example: 75.5,
    minimum: 0.01,
    required: true,
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Currency of the payment',
    example: 'USD',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    description: 'Channel through which the payment is initiated',
    example: 'USSD',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  channel: string;

  @ApiProperty({
    description: 'Message type for the transaction',
    example: 'MERCHANT_PAYMENT',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  messageType: string;

  @ApiProperty({
    description: 'Unique transaction identifier',
    example: 'TX123456789',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({
    description: 'Payment narration/description',
    example: 'Grocery payment',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  narration: string;
}

export class CashOutRequest {
  @ApiProperty({
    description: 'Subscriber mobile number',
    example: '263771234567',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  subscriberMobile: string;

  @ApiProperty({
    description: 'Agent phone number',
    example: '263773456789',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  agentPhone: string;

  @ApiProperty({
    description: 'Agent code',
    example: 'AGT001',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  agentCode: string;

  @ApiProperty({
    description: 'Cash out amount',
    example: 100.0,
    minimum: 0.01,
    required: true,
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Currency of the transaction',
    example: 'USD',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    description: 'Channel through which the cash out is initiated',
    example: 'USSD',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  channel: string;

  @ApiProperty({
    description: 'Unique transaction identifier',
    example: 'TX123456789',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  transactionId: string;
}

export class BankToOtherWalletTransferRequest {
  @ApiProperty({
    description: 'Phone number associated with the transaction',
    example: '263771234567',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'Destination wallet account',
    example: '263772345678',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  destinationWalletAccount: string;

  @ApiProperty({
    description: 'Source bank account number',
    example: '1234567890',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  sourceBankAccount: string;

  @ApiProperty({
    description: 'Transfer amount',
    example: 300.0,
    minimum: 0.01,
    required: true,
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'Currency of the transfer',
    example: 'USD',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({
    description: 'Channel through which the transfer is initiated',
    example: 'WEB',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  channel: string;

  @ApiProperty({
    description: 'Unique transaction identifier',
    example: 'TX123456789',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @ApiProperty({
    description: 'Transfer narration/description',
    example: 'Funds transfer',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  narration: string;
}
