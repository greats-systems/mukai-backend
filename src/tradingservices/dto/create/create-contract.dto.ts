import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateContractDto {
  @IsString()
  @IsNotEmpty()
  producer_id: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  quantity_kg: number;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}
