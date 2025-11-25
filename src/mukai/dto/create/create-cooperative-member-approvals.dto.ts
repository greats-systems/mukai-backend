import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsAlphanumeric,
  IsBoolean,
} from 'class-validator';

export class CreateCooperativeMemberApprovalsDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Optional custom ID for the poll',
    required: false,
  })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Optional custom creation timestamp',
    required: false,
  })
  @IsString()
  @IsOptional()
  created_at?: string;

  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'Optional group ID',
    required: false,
  })
  @IsString()
  @IsOptional()
  group_id?: string;

  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'ID of the individual member',
  })
  @IsString()
  @IsOptional()
  profile_id?: string;

  // @ApiProperty({
  //   example: 150,
  //   description: 'Optional total member count',
  //   required: false,
  // })
  // @IsInt()
  // @IsOptional()
  // no_of_members?: number;

  @ApiProperty({
    example: [
      '4ca7ce72-6f63-4a76-be8a-fe024d32fe1c',
      'd6b9e096-702d-44e2-93b1-8cc5418cf1f8',
    ],
    description: 'List of supporting member IDs',
  })
  @IsString()
  // @IsArray()
  @IsOptional()
  supporting_votes?: string[];

  @ApiProperty({
    example: [
      '4ca7ce72-6f63-4a76-be8a-fe024d32fe1c',
      'd6b9e096-702d-44e2-93b1-8cc5418cf1f8',
    ],
    description: 'List of supporting member IDs',
  })
  @IsString()
  @IsArray()
  @IsOptional()
  opposing_votes?: string[];

  @ApiProperty({
    example: 'Annual leadership election',
    description: 'Optional poll description',
    required: false,
  })
  @IsString()
  @IsOptional()
  poll_description?: string;

  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description:
      'Asset ID from assets table (useful when voting for asset purchase/sale)',
  })
  @IsString()
  @IsOptional()
  asset_id: string;

  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'Profile ID of elected member',
  })
  @IsString()
  @IsOptional()
  elected_member_profile_id?: string;

  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description:
      'Loan ID from loans table (useful when voting for loan application)',
  })
  @IsString()
  @IsOptional()
  loan_id: string;

  @ApiProperty({
    example: '11:05:27T19:28:51.0012354',
    description: 'Timestamp of when record was updated',
  })
  @IsString()
  @IsOptional()
  updated_at: string;

  @ApiProperty({
    example: true,
    description: 'Has the 75% consensus been reached?',
  })
  @IsBoolean()
  @IsOptional()
  consensus_reached: boolean;

  @ApiProperty({
    example: 0.05,
    description:
      'Additional information about the poll. Useful when updating the appropriate table',
  })
  @IsAlphanumeric()
  @IsOptional()
  additional_info: any;

  @ApiProperty({
    example: 'USD',
    description: 'Currency (useful when concluding a loan disbursement poll)',
  })
  @IsString()
  @IsOptional()
  currency: string;
}
