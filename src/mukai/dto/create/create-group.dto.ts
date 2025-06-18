import {
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UUID } from 'crypto';

export class CreateGroupDto {
  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Optional UUID for the group',
  })
  @IsOptional()
  @IsUUID()
  id?: UUID;

  @IsUUID()
  @IsOptional()
  admin_id?: string;

  @ApiProperty({
    example: 'Farmers Collective',
    description: 'Name of the group',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'agriculture',
    description: 'Category of the group',
    required: true,
  })
  @IsString()
  category: string;

  @ApiPropertyOptional({
    example: 'Nairobi',
    description: 'City where the group is based',
  })
  @IsOptional()
  @IsString()
  city?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({
    example: 50,
    description: 'Monthly subscription amount in USD',
  })
  @IsOptional()
  @IsNumber()
  monthly_sub?: number;

  @IsString()
  @IsArray()
  @IsOptional()
  members: string[];
}
