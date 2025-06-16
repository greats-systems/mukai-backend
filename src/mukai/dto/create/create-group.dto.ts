import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { SignupDto } from 'src/auth/dto/signup.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGroupDto {
  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Optional UUID for the group',
  })
  @IsOptional()
  @IsUUID()
  id?: string;

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

  @IsObject()
  @IsArray()
  @IsOptional()
  members?: SignupDto[];
}
