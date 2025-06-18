import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Message {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique message ID',
  })
  id: string;

  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'Sender profile ID',
  })
  profile_id: string;

  @ApiProperty({
    example: 'Hello, when is the next meeting?',
    description: 'Message content',
  })
  content: string;

  @ApiPropertyOptional({
    example: 'text',
    description: 'Content format',
    enum: ['text', 'image', 'video'],
  })
  content_format?: string;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'Message timestamp',
  })
  message_timestamp: string;

  @ApiPropertyOptional({
    example: '567e1234-e89b-43d2-b456-426614174000',
    description: 'Chat reference ID',
  })
  chat_id?: string;
}
