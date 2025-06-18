import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCooperativeMemberRequestDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Optional custom ID',
    required: false,
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Optional update timestamp',
    required: false,
  })
  @IsString()
  @IsOptional()
  updated_at?: string;

  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'Optional cooperative ID',
    required: false,
  })
  @IsString()
  @IsOptional()
  coop_id?: string;

  @ApiProperty({
    example: '456e7890-e12b-34d3-c567-426614174000',
    description: 'Optional member ID',
    required: false,
  })
  @IsString()
  @IsOptional()
  member_id?: string;

  @ApiProperty({
    example: 'membership',
    description: 'Optional request type',
    required: false,
    enum: ['membership', 'withdrawal', 'role_change'],
  })
  @IsString()
  @IsOptional()
  request_type?: string;

  @ApiProperty({
    example: 'pending',
    description: 'Optional initial status',
    required: false,
    enum: ['pending', 'approved', 'rejected'],
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    example: '789e0123-e45b-67d8-f901-426614174000',
    description: 'Optional resolver admin ID',
    required: false,
  })
  @IsString()
  @IsOptional()
  resolved_by?: string;

  @ApiProperty({
    example: 'Please review my application',
    description: 'Optional message',
    required: false,
  })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({
    example: 'Jane',
    description: 'Optional member first name',
    required: false,
  })
  @IsString()
  @IsOptional()
  profile_first_name?: string;

  @ApiProperty({
    example: 'Smith',
    description: 'Optional member last name',
    required: false,
  })
  @IsString()
  @IsOptional()
  profile_last_name?: string;

  @ApiProperty({
    example: 'Hello, here are my documents',
    description: 'Optional initial message content',
    required: false,
  })
  @IsString()
  @IsOptional()
  most_recent_content?: string;

  @ApiProperty({
    example: 'text',
    description: 'Optional content format',
    required: false,
    enum: ['text', 'image', 'document'],
  })
  @IsString()
  @IsOptional()
  most_recent_content_format?: string;

  @ApiProperty({
    example: '321e6543-e98b-12d3-b456-426614174000',
    description: 'Optional group ID',
    required: false,
  })
  @IsString()
  @IsOptional()
  group_id?: string;

  @ApiProperty({
    example: '321e6543-e98b-12d3-b456-426614174000',
    description: 'Cooperative category',
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    example: '321e6543-e98b-12d3-b456-426614174000',
    description: 'city',
    required: false,
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({
    example: '321e6543-e98b-12d3-b456-426614174000',
    description: 'country',
    required: false,
  })
  @IsString()
  @IsOptional()
  country?: string;


  @ApiProperty({
    example: '321e6543-e98b-12d3-b456-426614174000',
    description: 'province/state',
    required: false,
  })
  @IsString()
  @IsOptional()
  province_state?: string;
}
