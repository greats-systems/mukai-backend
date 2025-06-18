import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    example: 'Hello there!',
    description: 'Message content',
    required: true,
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Sender profile ID',
    required: true,
  })
  @IsUUID()
  profile_id: string;

  @ApiPropertyOptional({
    example: 'text',
    description: 'Content format type',
    enum: ['text', 'image', 'video'],
  })
  @IsOptional()
  @IsString()
  content_format?: string;

  @ApiPropertyOptional({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'Chat reference ID',
  })
  @IsOptional()
  @IsUUID()
  chat_id?: string;
}
