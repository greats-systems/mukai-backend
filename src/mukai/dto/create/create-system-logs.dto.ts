import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, IsObject } from 'class-validator';

export class CreateSystemLogDto {
  /*
  @ApiProperty({
    description: 'Unique identifier for the system log',
    example: '380ca6bc-cae9-4486-a543-056029aaba1c',
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: 'Timestamp of creation',
    example: '2025-08-21 12:58:15.357772+00',
  })
  @IsString()
  @IsOptional()
  created_at?: string;

  @ApiProperty({
    description: 'Timestamp of last update',
    example: '2025-08-21 12:58:15.357772+00',
  })
  @IsString()
  @IsOptional()
  updated_at?: string;
  */

  @ApiProperty({
    description: 'Profile ID UUID',
    example: '380ca6bc-cae9-4486-a543-056029aaba1c',
  })
  @IsUUID()
  @IsOptional()
  profile_id?: string;

  @ApiProperty({
    description: 'Profile name (useful for failed registration attempt)',
    example: 'Jon Jones',
  })
  @IsString()
  @IsOptional()
  profile_name?: string;

  @ApiProperty({
    description: 'Profile email (useful for failed password reset attempt)',
    example: 'jjones@gmail.com',
  })
  @IsString()
  @IsOptional()
  profile_email?: string;
  @ApiProperty({
    description: 'Profile phone (useful for failed password reset attempt)',
    example: '263778552011',
  })
  @IsString()
  @IsOptional()
  profile_phone?: string;

  @ApiProperty({
    description: 'Action performed',
    example: 'USER_LOGIN',
  })
  @IsString()
  @IsOptional()
  action: string;

  @ApiProperty({
    description: 'Request data in JSON format',
    example: { username: 'john_doe', timestamp: '2024-01-15T10:30:00Z' },
  })
  @IsObject()
  @IsOptional()
  request: any;

  @ApiProperty({
    description: 'Response data in JSON format',
    example: { status: 'success', user_id: '12345' },
  })
  @IsObject()
  @IsOptional()
  response: any;
  /*
  @ApiProperty({
    description: 'Cooperative member request ID UUID',
    example: '380ca6bc-cae9-4486-a543-056029aaba1c',
  })
  @IsUUID()
  @IsOptional()
  cooperative_member_request_id?: string;

  @ApiProperty({
    description: 'Cooperative ID UUID',
    example: '380ca6bc-cae9-4486-a543-056029aaba1c',
  })
  @IsUUID()
  @IsOptional()
  cooperative_id?: string;

  @ApiProperty({
    description: 'Poll ID UUID',
    example: '380ca6bc-cae9-4486-a543-056029aaba1c',
  })
  @IsUUID()
  @IsOptional()
  poll_id?: string;

  @ApiProperty({
    description: 'Loan ID UUID',
    example: '380ca6bc-cae9-4486-a543-056029aaba1c',
  })
  @IsUUID()
  @IsOptional()
  loan_id?: string;

  @ApiProperty({
    description: 'Transaction ID UUID',
    example: '380ca6bc-cae9-4486-a543-056029aaba1c',
  })
  @IsUUID()
  @IsOptional()
  transaction_id?: string;
  */

  @ApiProperty({
    description: 'Platform',
    example: 'Android',
    enum: ['Android', 'iOS', 'Web'],
  })
  @IsUUID()
  @IsOptional()
  platform?: string;
}
