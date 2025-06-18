import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Group {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the group',
  })
  id: string;

  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'Admin ID managing the group',
  })
  admin_id: string;

  @ApiProperty({
    example: 'Farmers Collective',
    description: 'Name of the group',
  })
  name: string;

  @ApiPropertyOptional({
    example: 'Nairobi',
    description: 'City where the group operates',
  })
  city?: string;

  @ApiPropertyOptional({
    example: 'Kenya',
    description: 'Country of operation',
  })
  country?: string;

  @ApiPropertyOptional({
    example: 50,
    description: 'Monthly subscription fee (USD)',
  })
  monthly_sub?: number;

  @ApiPropertyOptional({
    example:
      '[987e6543-e21b-43d2-b456-426614174000, 8a7e9543-f817be-ab44-5c33-fabc532d, ...]',
    description: 'List of group member IDs',
  })
  members?: string[];
}
