import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  // IsDateString,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    example: 'transfer',
    description: 'Transaction type',
    enum: ['transfer', 'deposit', 'withdrawal'],
    required: true,
  })
  @IsString()
  transaction_type: string;

  @ApiProperty({
    example: 100,
    description: 'Transaction amount',
    required: true,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Sending wallet ID',
    required: true,
  })
  @IsUUID()
  sending_wallet: string;

  @ApiPropertyOptional({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'Receiving wallet ID',
  })
  @IsOptional()
  @IsUUID()
  receiving_wallet: string;

  @ApiPropertyOptional({
    example: 'Payment for services',
    description: 'Transaction narrative',
  })
  @IsOptional()
  @IsString()
  narrative?: string;
}
