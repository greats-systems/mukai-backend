export class Commodity {
  name: string;
  description: string;
  quantity: number;
  unit_measurement: string;
  producer_id: string;
}

export class Contract {
  producer_id: string;
  title: string;
  description: string;
  value: number;
}

export class ContractBid {
  contract_id: string;
  provider_id: string;
  opening_date: string;
  status: string;
  closing_date: string;
  valued_at: number;
  award_date: string;
  awarded_to: string;
}

export class Producer {
  first_name: string;
  last_name: string;
  address: string;
  phone: string;
  email: string;
}

export class Provider {
  first_name: string;
  last_name: string;
  product_id: string;
  service_id: string;
}

export class ProviderProducts {
  product_name: string;
  unit_measure: string;
  unit_price: number;
  max_capacity: number;
}

export class ProviderServices {
  service_name: string;
  unit_measure: string;
  unit_price: number;
  max_capacity: number;
}

export class Trader {
  first_name: string;
  last_name: string;
  address: string;
  phone: string;
  email: string;
}

export class TraderInventory {
  trader_id: string;
  commodity_id: string;
  quantity: number;
  unit_measurement: string;
}
