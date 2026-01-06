import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateCooperativeMemberRequestDto {
  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Mandatory custom ID',
    required: true,
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({
    example: '2023-01-01T00:00:00Z',
    description: 'Mandatory create timestamp',
    required: true,
  })
  @IsString()
  @IsOptional()
  created_at?: string;

  @ApiPropertyOptional({
    example: '2023-01-01T00:00:00Z',
    description: 'Mandatory update timestamp',
    required: true,
  })
  @IsString()
  @IsOptional()
  updated_at?: string;

  @ApiProperty({
    example: '6134402a-d8f6-4090-856e-fca4bbfc0f04',
    description: 'Member ID',
    required: true,
  })
  @IsString()
  @IsOptional()
  member_id?: string;

  @ApiProperty({
    example: 'membership',
    description: 'Request type',
    required: true,
    enum: ['membership', 'withdrawal', 'role_change'],
  })
  @IsString()
  @IsOptional()
  request_type?: string;

  @ApiProperty({
    example: 'pending',
    description: 'Mandatory initial status',
    required: true,
    enum: ['pending', 'approved', 'rejected', 'invited'],
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    example: '7332a170-fa18-47c6-b5cc-8d740a2089f6',
    description: 'Mandatory group ID',
    required: true,
  })
  @IsString()
  @IsOptional()
  cooperative_id?: string;

  @ApiProperty({
    example: 'Agricultural Cooperatives',
    description: 'Cooperative category',
    required: true,
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    example: 'Harare',
    description: 'city',
    required: true,
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    example: 'Zimbabwe',
    description: 'country',
    required: true,
  })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({
    example: 'Harare',
    description: 'province/state',
    required: true,
  })
  @IsString()
  @IsOptional()
  province_state?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Flag to indicate if a member has been invited to join a coop',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  is_invited?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Flag to indicate if a member has requested to join a coop',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  has_requested?: boolean;
}
