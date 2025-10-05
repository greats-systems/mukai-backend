import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  // IsDateString,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { UUID } from 'crypto';

export class CreateTransactionDto {
  @ApiProperty({
    example: 'transfer',
    description: 'Transaction type',
    enum: ['transfer', 'deposit', 'withdrawal', 'payment'],
    required: true,
  })
  @IsString()
  transaction_type: string;

  @ApiProperty({
    example: 100,
    description: 'Transaction amount (USD)',
    required: true,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'Associated account ID',
    required: true,
  })
  @IsUUID()
  account_id: string;

  @ApiPropertyOptional({
    example: 5,
    description: 'Transaction fee (USD)',
  })
  @IsOptional()
  @IsNumber()
  transaction_cost?: number;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Sending wallet ID',
    required: true,
  })
  @IsUUID()
  sending_wallet: UUID;

  @ApiPropertyOptional({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'Receiving wallet ID',
  })
  @IsOptional()
  @IsUUID()
  receiving_wallet: string;

  @ApiPropertyOptional({
    example: '0789012345',
    description: 'Sending phone number',
  })
  @IsOptional()
  @IsUUID()
  sending_phone?: string;

  @ApiPropertyOptional({
    example: '0712345678',
    description: 'Receiving phone number',
  })
  @IsOptional()
  @IsUUID()
  receiving_phone?: string;

  @ApiPropertyOptional({
    example: 'payment',
    description: 'Transaction category (e.g., "groceries", "salary")',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    example: '2023-10-01T00:00:00Z',
    description: 'Creation timestamp',
  })
  @IsOptional()
  @IsString()
  created_date?: string;

  @ApiPropertyOptional({
    example: 'Payment for October services',
    description: 'Human-readable transaction name',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'user-123',
    description: 'Owner/initiator of the transaction',
  })
  @IsOptional()
  @IsString()
  owner?: string;

  @ApiPropertyOptional({
    example: 'Payment for services',
    description: 'Transaction narrative',
  })
  @IsOptional()
  @IsString()
  narrative?: string;

  @ApiPropertyOptional({
    example: 'abc123',
    description: 'Security salt for hashing',
  })
  @IsOptional()
  @IsString()
  salt?: string;

  @ApiPropertyOptional({
    example: 'usd',
    description: 'Transaction currency',
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({
    example: 'ecocash',
    description: 'Transfer mode',
  })
  @IsOptional()
  @IsString()
  transfer_mode?: string;
}
