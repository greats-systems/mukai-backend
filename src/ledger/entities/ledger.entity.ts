export class Commodity {
  commodity_id: string;
  name: string;
  description: string;
  quantity: number;
  unit_measurement: string;
  producer_id: string;
}

export class Contract {
  contract_id: string;
  producer_id: string;
  title: string;
  description: string;
  quantity_kg: number;
  value: number;
}

export class ContractBid {
  bid_id: string;
  contract_id: string;
  provider_id?: string;
  opening_date: string;
  status: string;
  closing_date?: string;
  award_date?: string;
  awarded_to?: string;
}

export class Producer {
  producer_id: string;
  first_name: string;
  last_name: string;
  address: string;
  phone: string;
  email: string;
}

export class Provider {
  provider_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  product_name: string;
  product_unit_measure: string;
  product_unit_price: number;
  product_max_capacity: number;
  service_name: string;
  service_unit_measure: string;
  service_unit_price: number;
  service_max_capacity: number;
}

export class ProviderProducts {
  product_id: string;
  provider_id: string;
  product_name: string;
  unit_measure: string;
  unit_price: number;
  max_capacity: number;
}

export class ProviderServices {
  service_id: string;
  provider_id: string;
  service_name: string;
  unit_measure: string;
  unit_price: number;
  max_capacity: number;
}

export class Trader {
  trader_id: string;
  first_name: string;
  last_name: string;
  address: string;
  phone: string;
  email: string;
}

export class TraderInventory {
  inventory_id: string;
  trader_id: string;
  commodity_id: string;
  quantity: number;
  unit_measurement: string;
}
