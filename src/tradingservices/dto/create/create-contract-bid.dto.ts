// create-contract-bid.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsIn,
} from 'class-validator';

export class CreateContractBidDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Contract ID',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  contract_id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Provider ID',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  provider_id: string;

  @ApiProperty({
    enum: ['pending', 'submitted', 'approved', 'rejected'],
    example: 'pending',
    description: 'Bid status',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['pending', 'submitted', 'approved', 'rejected'])
  status: string;

  @ApiProperty({
    example: '2023-12-31T23:59:59Z',
    description: 'Optional closing date',
    required: false,
  })
  @IsString()
  @IsOptional()
  closing_date?: string;

  @ApiProperty({
    example: '2023-12-31T23:59:59Z',
    description: 'Optional award date',
    required: false,
  })
  @IsString()
  @IsOptional()
  award_date?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Optional awarded to provider ID',
    required: false,
  })
  @IsString()
  @IsOptional()
  awarded_to?: string;
}
