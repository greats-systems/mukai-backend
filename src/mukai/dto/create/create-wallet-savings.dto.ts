import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUUID,
  IsNumber,
  IsArray,
  IsDateString,
} from 'class-validator';

export class CreateSavingsDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Wallet ID',
    required: true,
  })
  @IsUUID()
  wallet_id: string;

  @ApiProperty({
    example: 'Savings for vacation',
    description: 'Purpose of the wallet',
    required: true,
  })
  @IsString()
  purpose: string;

  @ApiProperty({
    example: 'USD',
    description: 'Savings currency',
    required: true,
  })
  @IsString()
  currency: string;

  @ApiProperty({
    example: 1000.5,
    description: 'Current balance',
    required: true,
  })
  @IsNumber()
  current_balance: number;

  @ApiPropertyOptional({
    example: 'lock_type_1',
    description: 'Lock feature',
  })
  @IsString()
  @IsOptional()
  lock_feature?: string;

  @ApiPropertyOptional({
    example: ['milestone1', 'milestone2'],
    description: 'Lock milestones',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  lock_milestones?: string[];

  @ApiPropertyOptional({
    example: '12:00:00+00',
    description: 'Lock date (time with time zone)',
  })
  @IsString()
  @IsOptional()
  lock_date?: string;

  @ApiPropertyOptional({
    example: 500.25,
    description: 'Lock amount',
  })
  @IsNumber()
  @IsOptional()
  lock_amount?: number;

  @ApiPropertyOptional({
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001',
    ],
    description: 'Endorser IDs',
  })
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  endoser_id?: string[];
}

export class SavingsPortfolioDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier',
    required: true,
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Creation timestamp',
    required: true,
  })
  @IsDateString()
  created_at: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Wallet ID',
    required: true,
  })
  @IsUUID()
  wallet_id: string;

  @ApiProperty({
    example: 'Savings for vacation',
    description: 'Purpose of the wallet',
    required: true,
  })
  @IsString()
  purpose: string;

  @ApiProperty({
    example: 1000.5,
    description: 'Current balance',
    required: true,
  })
  @IsNumber()
  current_balance: number;

  @ApiPropertyOptional({
    example: 'lock_type_1',
    description: 'Lock feature',
  })
  @IsString()
  @IsOptional()
  lock_feature?: string;

  @ApiPropertyOptional({
    example: ['milestone1', 'milestone2'],
    description: 'Lock milestones',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  lock_milestones?: string[];

  @ApiPropertyOptional({
    example: '12:00:00+00',
    description: 'Lock date (time with time zone)',
  })
  @IsString()
  @IsOptional()
  lock_date?: string;

  @ApiPropertyOptional({
    example: 500.25,
    description: 'Lock amount',
  })
  @IsNumber()
  @IsOptional()
  lock_amount?: number;

  @ApiPropertyOptional({
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001',
    ],
    description: 'Endorser IDs',
  })
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  endoser_id?: string[];

  @ApiPropertyOptional({
    example: 'unlock123',
    description: 'Unlocking code',
  })
  @IsString()
  @IsOptional()
  unlocking_code?: string;

  @ApiPropertyOptional({
    example: 'active',
    description: 'Status',
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    example: 'Recommended to increase savings',
    description: 'Last recommendation',
  })
  @IsString()
  @IsOptional()
  last_recommendation?: string;

  @ApiPropertyOptional({
    example: '12:00:00+00',
    description: 'Previous deposit date (time with time zone)',
  })
  @IsString()
  @IsOptional()
  previous_deposit_date?: string;
}
