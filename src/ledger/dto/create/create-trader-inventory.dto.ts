import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTraderInventoryDto {
  @IsString()
  @IsNotEmpty()
  trader_id: string;

  @IsString()
  @IsNotEmpty()
  commodity_id: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['kg', 'L'])
  unit_measurement: string;
}
