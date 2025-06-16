import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional } from 'class-validator';

export class Chat {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the chat (optional)',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiProperty({
    example:
      '123e4567-e89b-12d3-a456-426614174000-987e6543-e21b-43d2-b456-426614174000',
    description: 'Reference key for the chat (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  ref_key?: string;

  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'UUID of the message receiver (optional)',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  receiver_id?: string;

  @ApiProperty({
    example: '456e7890-e12b-34d3-c567-426614174000',
    description: 'Avatar ID of the receiver (optional)',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  receiver_avatar_id?: string;

  @ApiProperty({
    example: 'John',
    description: 'First name of the receiver (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  receiver_first_name?: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Last name of the receiver (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  receiver_last_name?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Profile ID of the sender (optional)',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  profile_id?: string;

  @ApiProperty({
    example: '789e0123-e45b-67d8-f901-426614174000',
    description: 'Avatar ID of the sender (optional)',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  profile_avatar_id?: string;

  @ApiProperty({
    example: 'Jane',
    description: 'First name of the sender (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  profile_first_name?: string;

  @ApiProperty({
    example: 'Smith',
    description: 'Last name of the sender (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  profile_last_name?: string;

  @ApiProperty({
    example: 'Hello, how are you?',
    description: 'Preview of the most recent message (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  most_recent_content?: string;

  @ApiProperty({
    example: 'text',
    description: 'Format of the most recent message (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  most_recent_content_format?: string;
}
