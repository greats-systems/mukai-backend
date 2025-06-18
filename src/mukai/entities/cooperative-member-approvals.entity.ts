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
    example: 150,
    description: 'Total number of members eligible to vote',
  })
  number_of_members: number;

  @ApiProperty({
    example: 120,
    description: 'Count of supporting votes',
  })
  supporting_votes: number;

  @ApiProperty({
    example: 30,
    description: 'Count of opposing votes',
  })
  opposing_votes: number;

  @ApiProperty({
    example: 'Approval of new membership criteria',
    description: 'Description of what the poll is about',
  })
  poll_description: string;
}
