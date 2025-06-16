import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCooperativeDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the cooperative (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  id?: string;

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

  @ApiProperty({
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
}
