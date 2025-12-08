import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { UUID } from 'crypto';

export class FiletrCooperativesDto {
  @ApiProperty({
    example: '8e8bf5e9-0702-4ebf-bd39-98d020f6da3f',
    description: 'Profile ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  profile_id?: string;

  @ApiProperty({
    example: 'Credit Unions',
    description: 'Cooperative category',
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    example: 'Mashonaland East',
    description: 'Province',
    required: false,
  })
  @IsString()
  @IsOptional()
  province?: string;

  @ApiProperty({
    example: 'Mutare',
    description: 'Unique identifier for the cooperative (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  city?: string;
}

export class FiletrCooperativesLikeDto {
  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'Profile ID',
    required: false,
  })
  @IsOptional()
  @IsString()
  profile_id?: string;

  @ApiProperty({
    example: 'Cre',
    description: 'Coop search term (name, category, city)',
    required: false,
  })
  @IsString()
  @IsOptional()
  search_term?: string;
}

export class CreateCooperativeDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the cooperative (optional)',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  id?: UUID;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the cooperative wallet (optional)',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  wallet_id?: string;

  @ApiProperty({
    example: '263718439965',
    description: 'Cooperative wallet phone number (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  coop_phone?: string;

  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'Admin ID who manages the cooperative (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  admin_id?: string;

  @ApiProperty({
    example: 'Green Farmers Collective',
    description: 'Name of the cooperative (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'Nairobi',
    description: 'City where the cooperative is based (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    example: 'Kenya',
    description: 'Country where the cooperative is registered (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({
    example: 'agriculture',
    description: 'Business category of the cooperative (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    example: 'A collective of organic farmers',
    description: 'Detailed description of the cooperative (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'https://example.com/logos/green-farmers.png',
    description: 'URL to the cooperative logo (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  logo?: string;

  @ApiProperty({
    example: 'To empower sustainable farming communities',
    description: 'Cooperative vision statement (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  vision_statement?: string;

  @ApiProperty({
    example: 'Providing fair market access to smallholder farmers',
    description: 'Cooperative mission statement (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  mission_statement?: string;

  @ApiProperty({
    example: 'Nairobi County',
    description: 'Province/state where the cooperative operates (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  province_state?: string;

  @ApiProperty({
    example: 5,
    description: 'Subscription paid by each coop member',
  })
  @IsNumber()
  monthly_sub: number;

  @ApiProperty({
    example: 0.05,
    description: 'Coop interest rate',
  })
  @IsNumber()
  interest_rate: number;

  @ApiProperty({
    example: 0.05,
    description: 'Additional info (useful when creating voting requests)',
  })
  @IsNumber()
  additional_info: any;

  @ApiProperty({
    example: '263789012345',
    description: 'Cooperative phone number (for SmileCash transactions)',
  })
  @IsString()
  phone: string;

  @ApiProperty({
    example: 10,
    description: 'Number of members in the coop',
  })
  @IsString()
  no_of_members: number;

  @ApiProperty({
    example: 10,
    description: 'Exchange rate',
  })
  @IsString()
  exchange_rate: number;
}
