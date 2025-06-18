import { ApiProperty } from '@nestjs/swagger';

export class CooperativeMemberRequest {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique request identifier',
  })
  id: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Last update timestamp',
  })
  updated_at: string;

  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'Cooperative ID',
  })
  coop_id: string;

  @ApiProperty({
    example: '456e7890-e12b-34d3-c567-426614174000',
    description: 'Member ID',
  })
  member_id: string;

  @ApiProperty({
    example: 'membership',
    description: 'Type of request (membership/withdrawal/etc)',
  })
  request_type: string;

  @ApiProperty({
    example: 'pending',
    description: 'Request status (pending/approved/rejected)',
  })
  status: string;

  @ApiProperty({
    example: '789e0123-e45b-67d8-f901-426614174000',
    description: 'Admin ID who resolved the request',
  })
  resolved_by: string;

  @ApiProperty({
    example: 'Additional documents required',
    description: 'Administrative notes',
  })
  message: string;

  @ApiProperty({
    example: 'John',
    description: 'Member first name',
  })
  profile_first_name: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Member last name',
  })
  profile_last_name: string;

  @ApiProperty({
    example: 'Hello, I want to join',
    description: 'Latest message content',
  })
  most_recent_content: string;

  @ApiProperty({
    example: 'text',
    description: 'Format of latest message',
  })
  most_recent_content_format: string;

  @ApiProperty({
    example: '321e6543-e98b-12d3-b456-426614174000',
    description: 'Group ID for the request',
  })
  group_id: string;
}
