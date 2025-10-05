import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class Organization {
  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description:
      'Optional system-generated unique identifier for the organization',
  })
  @IsString()
  @IsOptional()
  id: string;

  @ApiProperty({
    example: 'Green Agro Ltd',
    description: 'Legal trading name of the organization (required)',
    required: true,
  })
  @IsString()
  trading_name: string;

  @ApiPropertyOptional({
    example: 'cooperative',
    description:
      'Type of organizational account (e.g., cooperative, corporation)',
  })
  @IsString()
  @IsOptional()
  account_type: string;

  @ApiPropertyOptional({
    example: 'Organic Farming',
    description: 'Primary industry or specialization of the organization',
  })
  @IsString()
  @IsOptional()
  specialization: string;

  @ApiPropertyOptional({
    example: '263772123456',
    description: 'Primary contact phone number in international format',
  })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiPropertyOptional({
    example: 'info@greenagro.co.zw',
    description: 'Primary contact email address',
  })
  @IsString()
  @IsOptional()
  email: string;

  @ApiPropertyOptional({
    example: 'Harare',
    description: 'City where the organization is legally registered',
  })
  @IsString()
  @IsOptional()
  city: string;

  @ApiPropertyOptional({
    example: 'Zimbabwe',
    description: 'Country of legal registration',
  })
  @IsString()
  @IsOptional()
  country: string;

  @ApiPropertyOptional({
    example: 'TRD-78910-ZW',
    description: 'Government-issued trading license number',
  })
  @IsString()
  @IsOptional()
  trading_license: string;

  @ApiPropertyOptional({
    example: 'active',
    description: 'Current operational status',
    enum: ['active', 'inactive', 'suspended', 'pending'],
  })
  @IsString()
  @IsOptional()
  status: string;
}
