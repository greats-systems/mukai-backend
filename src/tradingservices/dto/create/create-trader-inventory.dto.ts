import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTraderInventoryDto {
  @IsString()
  @IsNotEmpty()
  inventory_id: string;

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
  unit_measurement: string;
}
