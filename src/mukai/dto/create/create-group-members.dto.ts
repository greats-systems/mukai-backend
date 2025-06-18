import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsString, IsUUID } from 'class-validator';

export class CreateGroupMemberDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the group members table',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: '2025-06-13 09:48:11.376032+00',
    description: 'Timestamp at which a record was created',
  })
  @IsString()
  created_at: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the group',
  })
  @IsUUID()
  cooperative_id: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for a member in a given group',
  })
  @IsUUID()
  @IsArray()
  member_id: string;

  @ApiPropertyOptional({
    example: 50,
    description: 'User role in specified group',
  })
  @IsString()
  role: string;

  /*
  @ApiPropertyOptional({
    type: () => [SignupDto],
    description: 'List of group members',
  })
  members?: SignupDto[];
  */
}
