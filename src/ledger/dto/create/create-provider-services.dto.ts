import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProviderServicesDto {
  @IsString()
  @IsNotEmpty()
  service_name: string;

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
