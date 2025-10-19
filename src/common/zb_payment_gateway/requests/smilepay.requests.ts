import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  IsEmail,
  IsUrl,
  IsIn,
} from 'class-validator';

export class StandardCheckoutRequest {
  @ApiProperty({
    description: 'Unique order reference identifier',
    example: 'ORD123456789',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  orderReference: string;

  @ApiProperty({
    description: 'Payment amount',
    example: 5,
    minimum: 0.01,
    required: true,
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'URL to return to after payment',
    example: 'https://merchant.com/return',
    required: true,
  })
  @IsUrl()
  @IsNotEmpty()
  returnUrl: string;

  @ApiProperty({
    description: 'URL to send payment result callback',
    example: 'https://merchant.com/webhook/payment-result',
    required: true,
  })
  @IsUrl()
  @IsNotEmpty()
  resultUrl: string;

  @ApiProperty({
    description: 'Name of the item being purchased',
    example: 'Smartphone X',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @ApiProperty({
    description: 'Description of the item being purchased',
    example: 'Latest smartphone with advanced features',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  itemDescription: string;

  @ApiProperty({
    description: 'Currency code for the payment (840 = USD, 924 = ZWL)',
    example: '840',
    enum: ['840', '924'],
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['840', '924'])
  currencyCode: string;

  @ApiProperty({
    description: 'Customer first name',
    example: 'John',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Customer last name',
    example: 'Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Customer mobile phone number',
    example: '263771234567',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  mobilePhoneNumber: string;

  @ApiProperty({
    description: 'Customer email',
    example: 'moyongqaa@gmail.com',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Payment method',
    example: 'WALLETPLUS',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiProperty({
    description: 'Cancel URL',
    example: 'www.cancel.com',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  cancelUrl: string;

  @ApiProperty({
    description: 'Failure URL',
    example: 'www.failure.com',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  failureUrl: string;
}

export class ExpressPaymentSmilePayRequestAuth {
  @ApiProperty({
    description: 'Unique order reference identifier',
    example: 'ORD123456789',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  orderReference: string;

  @ApiProperty({
    description: 'Payment amount',
    example: 100.5,
    minimum: 0.01,
    required: true,
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'URL to return to after payment',
    example: 'https://merchant.com/return',
    required: true,
  })
  @IsUrl()
  @IsNotEmpty()
  returnUrl: string;

  @ApiProperty({
    description: 'URL to send payment result callback',
    example: 'https://merchant.com/webhook/payment-result',
    required: true,
  })
  @IsUrl()
  @IsNotEmpty()
  resultUrl: string;

  @ApiProperty({
    description: 'Name of the item being purchased',
    example: 'Smartphone X',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @ApiProperty({
    description: 'Description of the item being purchased',
    example: 'Latest smartphone with advanced features',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  itemDescription: string;

  @ApiProperty({
    description: 'Currency code for the payment (840 = USD, 924 = ZWL)',
    example: '840',
    enum: ['840', '924'],
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['840', '924'])
  currencyCode: string;

  @ApiProperty({
    description: 'Customer first name',
    example: 'John',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Customer last name',
    example: 'Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Customer mobile phone number',
    example: '263771234567',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  mobilePhoneNumber: string;

  @ApiProperty({
    description: 'Customer email address',
    example: 'john.doe@example.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'URL to redirect to if payment is cancelled',
    example: 'https://merchant.com/cancel',
    required: true,
  })
  @IsUrl()
  @IsNotEmpty()
  cancelUrl: string;

  @ApiProperty({
    description: 'URL to redirect to if payment fails',
    example: 'https://merchant.com/failure',
    required: true,
  })
  @IsUrl()
  @IsNotEmpty()
  failureUrl: string;

  @ApiProperty({
    description: 'ZB Wallet mobile number for payment',
    example: '263771234567',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  zbWalletMobile: string;
}

export class ExpressPaymentSmilePayRequestConfirm {
  @ApiProperty({
    description: 'One-time password for transaction confirmation',
    example: '123456',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty({
    description: 'Transaction reference from auth response',
    example: 'TXN987654321',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  transactionReference: string;
}

export class ExpressPaymentConfirm {
  @ApiProperty({
    description: 'Response message from payment confirmation',
    example: 'Payment confirmed successfully',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  responseMessage: string;

  @ApiProperty({
    description: 'Response code indicating status',
    example: '00',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  responseCode: string;

  @ApiProperty({
    description: 'Transaction status',
    example: 'SUCCESS',
    enum: ['SUCCESS', 'PENDING', 'FAILED', 'CANCELLED'],
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({
    description: 'Unique transaction reference',
    example: 'TXN987654321',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  transactionReference: string;
}

export class ExpressPaymentAuth {
  @ApiProperty({
    description: 'Unique order reference identifier',
    example: 'ORD123456789',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  orderReference: string;

  @ApiProperty({
    description: 'Payment amount',
    example: 100.5,
    minimum: 0.01,
    required: true,
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({
    description: 'URL to return to after payment',
    example: 'https://merchant.com/return',
    required: true,
  })
  @IsUrl()
  @IsNotEmpty()
  returnUrl: string;

  @ApiProperty({
    description: 'URL to send payment result callback',
    example: 'https://merchant.com/webhook/payment-result',
    required: true,
  })
  @IsUrl()
  @IsNotEmpty()
  resultUrl: string;

  @ApiProperty({
    description: 'Name of the item being purchased',
    example: 'Smartphone X',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @ApiProperty({
    description: 'Description of the item being purchased',
    example: 'Latest smartphone with advanced features',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  itemDescription: string;

  @ApiProperty({
    description: 'Currency code for the payment (840 = USD, 924 = ZWL)',
    example: '840',
    enum: ['840', '924'],
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['840', '924'])
  currencyCode: string;

  @ApiProperty({
    description: 'Customer first name',
    example: 'John',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Customer last name',
    example: 'Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Customer mobile phone number',
    example: '263771234567',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  mobilePhoneNumber: string;
}

export class EcocashPaymentRequest extends PartialType(
  StandardCheckoutRequest,
) {}
