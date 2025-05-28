import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProviderDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  product_name: string;

  @IsOptional()
  @IsString()
  product_unit_measure: string;

  @IsOptional()
  @IsNumber()
  product_unit_price: number;

  @IsOptional()
  @IsNumber()
  product_max_capacity: number;

  @IsOptional()
  @IsString()
  service_name: string;

  @IsOptional()
  @IsString()
  service_unit_measure: string;

  @IsOptional()
  @IsNumber()
  service_unit_price: number;

  @IsOptional()
  @IsNumber()
  service_max_capacity: number;
}
