import { ApiProperty } from '@nestjs/swagger';

export class Commodity {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the commodity',
  })
  commodity_id: string;

  @ApiProperty({
    example: 'Organic Apples',
    description: 'The name of the commodity',
  })
  name: string;

  @ApiProperty({
    example: 'Fresh organic apples from local farm',
    description: 'Description of the commodity',
  })
  description: string;

  @ApiProperty({
    example: 100,
    description: 'Quantity available',
  })
  quantity: number;

  @ApiProperty({
    example: 'kilograms',
    description: 'Unit of measurement',
  })
  unit_measurement: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the producer',
  })
  producer_id: string;
}
