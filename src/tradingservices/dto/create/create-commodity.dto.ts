import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommodityDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['kg', 'L'])
  unit_measurement: string;

  @IsString()
  @IsNotEmpty()
  producer_id: string;
}
