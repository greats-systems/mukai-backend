import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateEscrowDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the escrow (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Timestamp when the escrow was created (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  created_at?: string;

  @ApiProperty({
    example: 'Project X Escrow',
    description: 'Name of the escrow (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  escrow_name?: string;

  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'Wallet ID associated with the escrow (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  wallet_id?: string;

  @ApiProperty({
    example: true,
    description: 'Flag to authorize transactions for the escrow (optional)',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  authorize_transaction?: boolean;
}
