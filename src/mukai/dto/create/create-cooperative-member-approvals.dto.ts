import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt } from 'class-validator';

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
    example: 150,
    description: 'Optional total member count',
    required: false,
  })
  @IsInt()
  @IsOptional()
  number_of_members?: number;

  @ApiProperty({
    example: 0,
    description: 'Optional initial supporting votes',
    required: false,
  })
  @IsInt()
  @IsOptional()
  supporting_votes?: number;

  @ApiProperty({
    example: 0,
    description: 'Optional initial opposing votes',
    required: false,
  })
  @IsInt()
  @IsOptional()
  opposing_votes?: number;

  @ApiProperty({
    example: 'Annual leadership election',
    description: 'Optional poll description',
    required: false,
  })
  @IsString()
  @IsOptional()
  poll_description?: string;
}
