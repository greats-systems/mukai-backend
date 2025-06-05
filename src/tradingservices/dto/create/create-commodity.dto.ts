// create-commodity.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCommodityDto {
  @ApiProperty({
    example: 'Wheat',
    description: 'Name of the commodity',
    required: true,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'High quality organic wheat',
    description: 'Detailed description of the commodity',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 1000,
    description: 'Quantity available',
    minimum: 1,
    required: true,
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    enum: ['kg', 'L'],
    example: 'kg',
    description: 'Unit of measurement',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['kg', 'L'])
  unit_measurement: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the producer',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  producer_id: string;
}
