import { ApiProperty } from '@nestjs/swagger';

export class SystemLog {
  @ApiProperty({
    description: 'Unique identifier for the system log',
    example: 'abbc1234-5678-90ab-cdef-1234567890ab',
  })
  id: string;

  @ApiProperty({
    description: 'Timestamp of creation',
    example: '2025-08-21 12:58:15.357772+00',
  })
  created_at: string;

  @ApiProperty({
    description: 'Timestamp of last update',
    example: '2025-08-21 12:58:15.357772+00',
  })
  updated_at: string;

  @ApiProperty({
    description: 'Profile ID UUID',
    example: '380ca6bc-cae9-4486-a543-056029aaba1c',
  })
  profile_id: string;

  @ApiProperty({
    description: 'Action performed',
    example: 'USER_LOGIN',
  })
  action: string;

  @ApiProperty({
    description: 'Request data in JSON format',
    example: { username: 'john_doe', timestamp: '2024-01-15T10:30:00Z' },
  })
  request: any;

  @ApiProperty({
    description: 'Response data in JSON format',
    example: { status: 'success', user_id: '12345' },
  })
  response: any;

  @ApiProperty({
    description: 'Cooperative member request ID UUID',
    example: '380ca6bc-cae9-4486-a543-056029aaba1c',
  })
  cooperative_member_request_id: string;

  @ApiProperty({
    description: 'Cooperative ID UUID',
    example: '380ca6bc-cae9-4486-a543-056029aaba1c',
  })
  cooperative_id: string;

  @ApiProperty({
    description: 'Poll ID UUID',
    example: '380ca6bc-cae9-4486-a543-056029aaba1c',
  })
  poll_id: string;

  @ApiProperty({
    description: 'Loan ID UUID',
    example: '380ca6bc-cae9-4486-a543-056029aaba1c',
  })
  loan_id: string;

  @ApiProperty({
    description: 'Transaction ID UUID',
    example: '380ca6bc-cae9-4486-a543-056029aaba1c',
  })
  transaction_id: string;
}
