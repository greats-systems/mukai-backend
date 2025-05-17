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

export class CreateContractBidDto {
  @IsString()
  @IsNotEmpty()
  contract_id: string;

  @IsString()
  @IsNotEmpty()
  provider_id: string;

  @IsString()
  @IsNotEmpty()
  opening_date: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  // @IsNotEmpty()
  closing_date: string;

  @IsNumber()
  @IsNotEmpty()
  valued_at: number;

  @IsString()
  // @IsNotEmpty()
  award_date: string;

  @IsString()
  // @IsNotEmpty()
  awarded_to: string;
}

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

export class CreateProducerDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}

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

  @IsNumber()
  @IsNotEmpty()
  unit_price: number;

  @IsNumber()
  @IsNotEmpty()
  max_capacity: number;
}

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

  @IsString()
  product_name: string;

  @IsString()
  service_name: string;
}

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

export class CreateTraderDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}
