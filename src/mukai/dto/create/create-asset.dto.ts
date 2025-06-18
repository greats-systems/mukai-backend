import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssetDto {
  // @ApiProperty({
  //   example: '123e4567-e89b-12d3-a456-426614174000',
  //   description: 'Unique identifier for the asset (optional)',
  //   required: false,
  // })
  // @IsString()
  // @IsOptional()
  // id?: string;
  @ApiProperty({
    example: 'Toyata Fortuner 2025 model',
    description: 'Descriptive name of the asset (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  asset_descriptive_name?: string;

  @ApiProperty({
    example: 'Red Toyata Fortuner 2025 model with 100000 km on odometer and 2025 registration. It is in good condition and has been well maintained.',
    description: 'Descriptive description of the asset (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  asset_description?: string;

  @ApiProperty({
    example: ['https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png', 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png'],  
    description: 'Asset images URLs (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  asset_images?: string[];

  @ApiProperty({
    example: 'account-address-xyz',
    description: 'Account holding the asset (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  holding_account?: string;

  @ApiProperty({
    example: 'USD',
    description: 'Currency used for valuation (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  valuation_currency?: string;

  @ApiProperty({
    example: 1000.50,
    description: 'Fiat value of the asset (optional)',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  fiat_value?: number;

  @ApiProperty({
    example: 10.5,
    description: 'Token value of the asset (optional)',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  token_value?: number;

  @ApiProperty({
    example: 'board-id-xyz',
    description: 'Governing board for the asset (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  governing_board?: string;

  @ApiProperty({
    example: '2023-12-31T23:59:59Z',
    description: 'Timestamp of last transaction (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  last_transaction_timestamp?: string;

  @ApiProperty({
    example: 'issuer-id-xyz',
    description: 'ID of verifiable certificate issuer (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  verifiable_certificate_issuer_id?: string;

  @ApiProperty({
    example: ['document-id-xyz', 'document-id-xyz'],
    description: 'Legal documents associated with the asset (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  legal_documents?: string[];

  @ApiProperty({
    example: true,
    description: 'Whether the asset has a verifiable certificate (optional)',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  has_verifiable_certificate?: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether the asset has been valuated (optional)',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_valuated?: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether the asset has been minted (optional)',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_minted?: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether the asset is shared (optional)',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_shared?: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether the asset is active (optional)',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether the asset has associated documents (optional)',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  has_documents?: boolean;

  @ApiProperty({
    example: 'active',
    description: 'Current status of the asset (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Associated profile ID (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  profile_id?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Associated Cooperative ID (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  group_id?: string;
}