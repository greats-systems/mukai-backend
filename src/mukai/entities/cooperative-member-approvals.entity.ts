import { ApiProperty } from '@nestjs/swagger';

export class CooperativeMemberApprovals {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the approval poll',
  })
  id: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Timestamp when the poll was created',
  })
  created_at: string;

  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'ID of the cooperative group',
  })
  group_id: string;

  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'ID of the individual member',
  })
  profile_id: string;

  @ApiProperty({
    example: 150,
    description: 'Total number of members in a cooperative',
  })
  number_of_members: number;

  @ApiProperty({
    example: [
      '4ca7ce72-6f63-4a76-be8a-fe024d32fe1c',
      'd6b9e096-702d-44e2-93b1-8cc5418cf1f8',
    ],
    description: 'List of supporting member IDs',
  })
  supporting_votes: string;

  @ApiProperty({
    example: [
      '987e6543-e21b-43d2-b456-426614174000',
      'ac4a5a4b-6044-44d4-8258-3ebb88dc83f8',
    ],
    description: 'List of opposing member IDs',
  })
  opposing_votes: string;

  @ApiProperty({
    example: 'Approval of new membership criteria',
    description: 'Description of what the poll is about',
  })
  poll_description: string;

  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description:
      'Asset ID from assets table (useful when voting for asset purchase/sale)',
  })
  asset_id: string;

  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description:
      'Loan ID from loans table (useful when voting for loan application)',
  })
  loan_id: string;

  @ApiProperty({
    example: true,
    description: 'Has the 75% consensus been reached?',
  })
  consensus_reached: boolean;

  @ApiProperty({
    example: '11:05:27T19:28:51.0012354',
    description: 'Timestamp of when record was updated',
  })
  updated_at: string;

  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description:
      'Loan ID from loans table (useful when voting for loan application)',
  })
  additional_info: any;
}
