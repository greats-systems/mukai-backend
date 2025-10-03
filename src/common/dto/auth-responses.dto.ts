import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({
    description: 'User ID',
    example: '7244f219-a9f1-4f97-a01d-7c994fc3265b',
  })
  id: string;

  @ApiProperty({
    description: 'User email',
    example: 'moyongqaa1@gmail.com',
  })
  email: string;

  @ApiPropertyOptional({
    description: 'User phone number',
    example: '263718439965',
    nullable: true,
  })
  phone?: string | null;

  @ApiProperty({
    description: 'User first name',
    example: 'simon',
  })
  first_name: string;

  @ApiProperty({
    description: 'User last name',
    example: 'moyo',
  })
  last_name: string;

  @ApiProperty({
    description: 'Account type',
    example: 'coop-manager',
  })
  account_type: string;

  @ApiProperty({
    description: 'Wallet ID',
    example: '7244f219-a9f1-4f97-a01d-7c994fc3265b',
  })
  wallet_id: string;

  @ApiProperty({
    description: 'User role',
    example: 'authenticated',
  })
  role: string;
}

export class AuthSuccessResponse {
  @ApiProperty({
    description: 'status',
    example: 'Account created',
  })
  status: string;

  @ApiProperty({
    description: 'statusCode',
    example: 201,
  })
  statusCode: number;

  @ApiProperty({
    description: 'status',
    example: 'Account created',
  })
  message: string;

  @ApiProperty({
    description: 'access_token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJtd2FsZUBnbWFpbC5jb20iLCJzdWIiOiI4ZjcwODMxMS1iMzY4LTQzOTUtODg3YS04N2M0MmI2YzJhMTciLCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImlhdCI6MTc1NjgxMTAyNiwiZXhwIjoxNzU2ODE0NjI2fQ.WHuC3MM9KrdB84a2p6bED5p2csxOw57Hup8z8dUc6mo',
  })
  access_token: string;
  @ApiProperty({
    description: 'user',
    example: {
      id: '7244f219-a9f1-4f97-a01d-7c994fc3265b',
      email: 'moyongqaa1@gmail.com',
      phone: '263718439965',
      first_name: 'simon',
      last_name: 'moyo',
      account_type: 'coop-manager',
      created_at: '2025-08-26T11:02:09.719448+02:00',
      dob: '2009-01-01',
      gender: 'MALE',
      wallet_id: '01d8b911-65b9-467e-9b18-2e3facd389a3',
      cooperative_id: null,
      business_id: null,
      updated_at: '2025-09-02T12:27:35.711789+02:00',
      affliations: null,
      coop_account_id: null,
      push_token: '',
      avatar: null,
      national_id_url: null,
      passport_url: null,
      role: 'authenticated',
    },
  })
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    account_type: string;
    dob: string;
    gender: string;
    wallet_id: string;
    // cooperative_id: signupDto.cooperative_id;
    business_id: string;
    affiliations: string;
    coop_account_id: string;
    push_token: string;
    avatar: string;
    national_id_url: string;
    passport_url: string;
    role: string;
  };
  data: string | undefined;
  error: null;
}

export class AuthLoginSuccessResponse {
  @ApiProperty({
    description: 'Status message',
    example: 'account authenticated',
  })
  status: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Detailed message',
    example: 'account authenticated successfully',
  })
  message: string;

  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiPropertyOptional({
    description: 'Refresh token',
    example: 'refresh_token_value',
    nullable: true,
  })
  refresh_token?: string;

  @ApiProperty({
    description: 'Token type',
    example: 'bearer',
  })
  token_type: string;

  @ApiProperty({ type: UserResponse })
  user: UserResponse;

  @ApiPropertyOptional({
    description: 'Additional data',
    nullable: true,
  })
  data?: string;

  // @ApiPropertyOptional({
  //   description: 'Error information',
  //   nullable: true,
  // })
  // error?: null;
}
export class AuthErrorResponse {
  @ApiProperty({
    description: 'status',
    example: 'failed',
  })
  status: string;
  @ApiProperty({
    description: 'message',
    example: 'Login failed',
  })
  message: string;
  @ApiProperty({
    description: 'access_token (always null)',
    example: null,
  })
  access_token: null;
  @ApiProperty({
    description: 'error',
    example: 'Invalid login credentials',
  })
  error: object;
  @ApiProperty({
    description: 'user (always null)',
    example: null,
  })
  user: null;
  @ApiProperty({
    description: 'statusCode',
    example: 401,
  })
  statusCode: number;
}
