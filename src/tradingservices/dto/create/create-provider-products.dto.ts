import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProviderProductsDto {
  @IsString()
  @IsNotEmpty()
  product_name: string;

  @IsString()
  @IsNotEmpty()
  provider_id: string;

  @IsString()
  @IsNotEmpty()
  unit_measure: string;

  @IsString()
  @IsNotEmpty()
  unit_price: number;

  @IsString()
  @IsNotEmpty()
  max_capacity: number;
}
