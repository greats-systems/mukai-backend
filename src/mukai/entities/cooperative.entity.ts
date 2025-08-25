import { ApiProperty } from '@nestjs/swagger';

export class Cooperative {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the cooperative',
  })
  id: string;

  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'Admin ID who manages the cooperative',
  })
  admin_id: string;

  @ApiProperty({
    example: 'Green Farmers Collective',
    description: 'Name of the cooperative',
  })
  name: string;

  @ApiProperty({
    example: 'Nairobi',
    description: 'City where the cooperative is based',
  })
  city: string;

  @ApiProperty({
    example: 'Kenya',
    description: 'Country where the cooperative is registered',
  })
  country: string;

  @ApiProperty({
    example: 'agriculture',
    description: 'Business category of the cooperative',
  })
  category: string;

  @ApiProperty({
    example: 'A collective of organic farmers',
    description: 'Detailed description of the cooperative',
  })
  description: string;

  @ApiProperty({
    example: 'https://example.com/logos/green-farmers.png',
    description: 'URL to the cooperative logo',
  })
  logo: string;

  @ApiProperty({
    example: 'To empower sustainable farming communities',
    description: 'Cooperative vision statement',
  })
  vision_statement: string;

  @ApiProperty({
    example: 'Providing fair market access to smallholder farmers',
    description: 'Cooperative mission statement',
  })
  mission_statement: string;

  @ApiProperty({
    example: 'Nairobi County',
    description: 'Province/state where the cooperative operates',
  })
  province_state: string;

  /*
  @ApiProperty({
    example: '987e6543-e21b-43d2-b456-426614174000',
    description: 'ID or the cooperative wallet',
  })
  wallet_id: string;
  */

  @ApiProperty({
    example: 5,
    description: 'Subscription paid by each coop member',
  })
  monthly_sub: number;

  @ApiProperty({
    example: 0.05,
    description: 'Coop interest rate',
  })
  interest_rate: number;

  @ApiProperty({
    example: '263770123456',
    description: 'Cooperative phone number (for SmileCash transactions)',
  })
  coop_phone: string;
}
