/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  Commodity,
  ContractBid,
  Contract,
  Producer,
  Provider,
  ProviderProducts,
  ProviderServices,
  Trader,
  TraderInventory,
} from './entities/ledger.entity';
import { PostgresRest } from 'src/common/postgresrest/postgresrest';
import * as CreateLedgerDto from './dto/create-ledger.dto';
import * as UpdateLedgerDto from './dto/update-ledger.dto';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class CommodityService {
  private readonly logger = initLogger(CommodityService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createCommodity(
    createCommodityDto: CreateLedgerDto.CreateCommodityDto,
  ): Promise<Commodity | undefined> {
    const commodity = new Commodity();
    commodity.producer_id = createCommodityDto.producer_id;
    commodity.name = createCommodityDto.name;
    commodity.description = createCommodityDto.description;
    commodity.quantity = createCommodityDto.quantity;
    commodity.unit_measurement = createCommodityDto.unit_measurement;

    const new_commodity = await this.postgresrest
      .from('Commodity')
      .insert(commodity)
      .single();
    if (new_commodity.data) {
      return new_commodity;
    } else {
      return;
    }
  }

  async findAllCommodities(): Promise<Commodity[]> {
    try {
      const { data, error } = await this.postgresrest
        .from('Commodity')
        .select();

      if (error) {
        this.logger.error('Error fetching commodities', error);
        return [];
      }

      return data as Commodity[];
    } catch (error) {
      this.logger.error('Exception in findAllCommodities', error);
      return [];
    }
  }

  async viewCommodity(commodity_id: string): Promise<Commodity | null> {
    try {
      const { data, error } = await this.postgresrest
        .from('Commodity')
        .select('*')
        .eq('commodity_id', commodity_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching commodity ${commodity_id}`, error);
        return null;
      }

      return data as Commodity;
    } catch (error) {
      this.logger.error(
        `Exception in viewCommodity for id ${commodity_id}`,
        error,
      );
      return null;
    }
  }
}

@Injectable()
export class ContractBidService {
  private readonly logger = initLogger(ContractBidService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createContractBid(
    createContractBidDto: CreateLedgerDto.CreateContractBidDto,
  ): Promise<ContractBid | undefined> {
    const bid = new ContractBid();
    bid.provider_id = createContractBidDto.provider_id;
    bid.opening_date = createContractBidDto.opening_date;
    bid.status = 'open';
    // bid.closing_date = createContractBidDto.closing_date;
    bid.valued_at = createContractBidDto.valued_at;
    // bid.award_date = createContractBidDto.award_date;
    // bid.awarded_to = createContractBidDto.awarded_to;

    const new_bid = await this.postgresrest
      .from('ContractBid')
      .insert(bid)
      .single();
    if (new_bid.data) {
      return new_bid;
    } else {
      return;
    }
  }

  async findAllBids(): Promise<ContractBid[]> {
    try {
      const { data, error } = await this.postgresrest
        .from('ContractBid')
        .select('*, Contract(*)');

      if (error) {
        this.logger.error('Error fetching contract bids', error);
        return [];
      }

      return data as ContractBid[];
    } catch (error) {
      this.logger.error('Exception in findAllBids', error);
      return [];
    }
  }

  async viewBid(bid_id: string): Promise<ContractBid | null> {
    try {
      const { data, error } = await this.postgresrest
        .from('ContractBid')
        .select('*, Contract(*)')
        .eq('bid_id', bid_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching contract bid ${bid_id}`, error);
        return null;
      }

      return data as ContractBid;
    } catch (error) {
      this.logger.error(`Exception in viewBid for id ${bid_id}`, error);
      return null;
    }
  }

  async updateBid(
    bid_id: string,
    updateContractBidDto: UpdateLedgerDto.UpdateContractBidDto,
  ): Promise<ContractBid | null> {
    try {
      const { data, error } = await this.postgresrest
        .from('ContractBid')
        .update({
          provider_id: updateContractBidDto.provider_id,
          status: updateContractBidDto.status,
          closing_date: updateContractBidDto.closing_date,
          valued_at: updateContractBidDto.valued_at,
          award_date: updateContractBidDto.award_date,
          awarded_to: updateContractBidDto.awarded_to,
        })
        .eq('bid_id', bid_id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating bid ${bid_id}`, error);
        return null;
      }
      return data as ContractBid;
    } catch (error) {
      this.logger.error(`Exception in updateBid for id ${bid_id}`, error);
      return null;
    }
  }

  async deleteBid(bid_id: string): Promise<boolean> {
    try {
      const { error } = await this.postgresrest
        .from('ContractBid')
        .delete()
        .eq('bid_id', bid_id);

      if (error) {
        this.logger.error(`Error deleting bid ${bid_id}`, error);
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error(`Exception in deleteBid for id ${bid_id}`, error);
      return false;
    }
  }
}

@Injectable()
export class ContractService {
  private readonly logger = initLogger(ContractService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createContract(
    createContractDto: CreateLedgerDto.CreateContractDto,
  ): Promise<Contract | undefined> {
    // Start a transaction
    const { data: new_contract, error: contractError } = await this.postgresrest
      .from('Contract')
      .insert({
        producer_id: createContractDto.producer_id,
        title: createContractDto.title,
        description: createContractDto.description,
        quantity_kg: createContractDto.quantity_kg,
        value: createContractDto.value,
      })
      .select()
      .single();

    if (!new_contract || contractError) {
      this.logger.error('Failed to create contract', contractError);
      return undefined;
    }

    // Create the associated bid
    const { error: bidError } = await this.postgresrest
      .from('ContractBid')
      .insert({
        contract_id: new_contract.contract_id, // Use the returned contract_id
        status: 'open',
        valued_at: createContractDto.value,
      });

    if (bidError) {
      this.logger.error('Failed to create contract bid', bidError);
      // Consider rolling back the contract creation here
      throw new Error('Contract created but failed to create bid');
    }

    return new_contract as Contract;
  }

  async findAllContracts(): Promise<Contract[]> {
    try {
      const { data, error } = await this.postgresrest.from('Contract').select();

      if (error) {
        this.logger.error('Error fetching contracts', error);
        return [];
      }

      return data as Contract[];
    } catch (error) {
      this.logger.error('Exception in findAllContracts', error);
      return [];
    }
  }

  async viewContract(contract_id: string): Promise<Contract | null> {
    try {
      const { data, error } = await this.postgresrest
        .from('Contract')
        .select('*')
        .eq('contract_id', contract_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching contract ${contract_id}`, error);
        return null;
      }

      return data as Contract;
    } catch (error) {
      this.logger.error(
        `Exception in viewContract for id ${contract_id}`,
        error,
      );
      return null;
    }
  }

  async updateContract(
    contract_id: string,
    updateContractDto: UpdateLedgerDto.UpdateContractDto,
  ): Promise<Contract | null> {
    try {
      const { data, error } = await this.postgresrest
        .from('Contract')
        .update({
          title: updateContractDto.title,
          description: updateContractDto.description,
          value: updateContractDto.value,
        })
        .eq('contract_id', contract_id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating contract ${contract_id}`, error);
        return null;
      }
      return data as Contract;
    } catch (error) {
      this.logger.error(
        `Exception in updateContract for id ${contract_id}`,
        error,
      );
      return null;
    }
  }

  async deleteContract(contract_id: string): Promise<boolean> {
    try {
      const { error } = await this.postgresrest
        .from('Contract')
        .delete()
        .eq('contract_id', contract_id);

      if (error) {
        this.logger.error(`Error deleting contract ${contract_id}`, error);
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Exception in deleteContract for id ${contract_id}`,
        error,
      );
      return false;
    }
  }
}

@Injectable()
export class ProducerService {
  private readonly logger = initLogger(ProducerService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createProducer(
    createProducerDto: CreateLedgerDto.CreateProducerDto,
  ): Promise<Producer | undefined> {
    const producer = new Producer();
    producer.first_name = createProducerDto.first_name;
    producer.last_name = createProducerDto.last_name;
    producer.address = createProducerDto.address;
    producer.phone = createProducerDto.phone;
    producer.email = createProducerDto.email;

    const new_producer = await this.postgresrest
      .from('Producer')
      .insert(producer)
      .single();
    if (new_producer.data) {
      return new_producer;
    } else {
      return;
    }
  }

  async findAllProducers(): Promise<Producer[]> {
    try {
      const { data, error } = await this.postgresrest.from('Producer').select();

      if (error) {
        this.logger.error('Error fetching producers', error);
        return [];
      }

      return data as Producer[];
    } catch (error) {
      this.logger.error('Exception in findAllProducers', error);
      return [];
    }
  }

  async viewProducer(producer_id: string): Promise<Producer | null> {
    try {
      const { data, error } = await this.postgresrest
        .from('Producer')
        .select('*')
        .eq('producer_id', producer_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching producer ${producer_id}`, error);
        return null;
      }

      return data as Producer;
    } catch (error) {
      this.logger.error(
        `Exception in viewProducer for id ${producer_id}`,
        error,
      );
      return null;
    }
  }
}

@Injectable()
export class ProviderService {
  private readonly logger = initLogger(ProviderService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createProvider(
    createProviderDto: CreateLedgerDto.CreateProviderDto,
  ): Promise<Provider | undefined> {
    const provider = new Provider();
    provider.first_name = createProviderDto.first_name;
    provider.last_name = createProviderDto.last_name;
    provider.phone = createProviderDto.phone;
    provider.email = createProviderDto.email;
    provider.product_name = createProviderDto.product_name;
    provider.service_name = createProviderDto.service_name;

    const new_provider = await this.postgresrest
      .from('Provider')
      .insert(provider)
      .single();
    if (new_provider.data) {
      return new_provider;
    } else {
      return;
    }
  }

  async findAllProviders(): Promise<Provider[]> {
    try {
      const { data, error } = await this.postgresrest.from('Provider').select();

      if (error) {
        this.logger.error('Error fetching providers', error);
        return [];
      }

      return data as Provider[];
    } catch (error) {
      this.logger.error('Exception in findAllProviders', error);
      return [];
    }
  }

  async viewProvider(provider_id: string): Promise<Provider | null> {
    try {
      const { data, error } = await this.postgresrest
        .from('Provider')
        .select('*')
        .eq('provider_id', provider_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching provider ${provider_id}`, error);
        return null;
      }

      return data as Provider;
    } catch (error) {
      this.logger.error(
        `Exception in viewProvider for id ${provider_id}`,
        error,
      );
      return null;
    }
  }
}

@Injectable()
export class ProviderProductsService {
  private readonly logger = initLogger(ProviderProductsService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createProviderProduct(
    createProviderProductDto: CreateLedgerDto.CreateProviderProductsDto,
  ): Promise<ProviderProducts | undefined> {
    const product = new ProviderProducts();
    product.provider_id = createProviderProductDto.provider_id;
    product.product_name = createProviderProductDto.product_name;
    product.unit_measure = createProviderProductDto.unit_measure;
    product.unit_price = createProviderProductDto.unit_price;
    product.max_capacity = createProviderProductDto.max_capacity;

    const new_product = await this.postgresrest
      .from('ProviderProducts')
      .insert(product)
      .single();
    if (new_product.data) {
      return new_product;
    } else {
      return;
    }
  }

  async findAllProducts(): Promise<ProviderProducts[]> {
    try {
      const { data, error } = await this.postgresrest
        .from('ProviderProducts')
        .select();

      if (error) {
        this.logger.error('Error fetching products', error);
        return [];
      }

      return data as ProviderProducts[];
    } catch (error) {
      this.logger.error('Exception in findAllProducts', error);
      return [];
    }
  }

  async viewProviderProducts(
    product_id: string,
  ): Promise<ProviderProducts | null> {
    try {
      const { data, error } = await this.postgresrest
        .from('ProviderProducts')
        .select('*')
        .eq('product_id', product_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching product ${product_id}`, error);
        return null;
      }

      return data as ProviderProducts;
    } catch (error) {
      this.logger.error(
        `Exception in viewProviderProducts for id ${product_id}`,
        error,
      );
      return null;
    }
  }

  async updateProviderProducts(
    product_id: string,
    updateProviderProductsDto: UpdateLedgerDto.UpdateProviderProductsDto,
  ): Promise<ProviderProducts | null> {
    try {
      const { data, error } = await this.postgresrest
        .from('ProviderProducts')
        .update({
          unit_price: updateProviderProductsDto.unit_price,
          max_capacity: updateProviderProductsDto.max_capacity,
        })
        .eq('product_id', product_id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating products ${product_id}`, error);
        return null;
      }
      return data as ProviderProducts;
    } catch (error) {
      this.logger.error(
        `Exception in updateProviderProducts for id ${product_id}`,
        error,
      );
      return null;
    }
  }

  async deleteProviderProducts(product_id: string): Promise<boolean> {
    try {
      const { error } = await this.postgresrest
        .from('ProviderProducts')
        .delete()
        .eq('product_id', product_id);

      if (error) {
        this.logger.error(`Error deleting product ${product_id}`, error);
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Exception in deleteProviderProducts for id ${product_id}`,
        error,
      );
      return false;
    }
  }
}

@Injectable()
export class ProviderServicesService {
  private readonly logger = initLogger(ProviderServicesService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createProviderService(
    createProviderServiceDto: CreateLedgerDto.CreateProviderServicesDto,
  ): Promise<ProviderServices | null> {
    const service = new ProviderServices();
    service.provider_id = createProviderServiceDto.provider_id;
    service.service_name = createProviderServiceDto.service_name;
    service.unit_measure = createProviderServiceDto.unit_measure;
    service.unit_price = createProviderServiceDto.unit_price;
    service.max_capacity = createProviderServiceDto.max_capacity;

    const new_service = await this.postgresrest
      .from('ProviderServices')
      .insert(service)
      .single();
    if (new_service.data) {
      return new_service;
    } else {
      return null;
    }
  }

  async findAllServices(): Promise<ProviderServices[]> {
    try {
      const { data, error } = await this.postgresrest
        .from('ProviderServices')
        .select();

      if (error) {
        this.logger.error('Error fetching services', error);
        return [];
      }

      return data as ProviderServices[];
    } catch (error) {
      this.logger.error('Exception in findAllServices', error);
      return [];
    }
  }

  async viewProviderServices(
    service_id: string,
  ): Promise<ProviderServices | null> {
    try {
      const { data, error } = await this.postgresrest
        .from('ProviderServices')
        .select('*')
        .eq('service_id', service_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching service ${service_id}`, error);
        return null;
      }

      return data as ProviderServices;
    } catch (error) {
      this.logger.error(
        `Exception in viewProviderService for id ${service_id}`,
        error,
      );
      return null;
    }
  }

  async updateProviderServices(
    service_id: string,
    updateProviderServicesDto: UpdateLedgerDto.UpdateProviderServicesDto,
  ): Promise<ProviderServices | null> {
    try {
      const { data, error } = await this.postgresrest
        .from('ProviderServices')
        .update({
          unit_price: updateProviderServicesDto.unit_price,
          max_capacity: updateProviderServicesDto.max_capacity,
        })
        .eq('service_id', service_id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating services ${service_id}`, error);
        return null;
      }
      return data as ProviderServices;
    } catch (error) {
      this.logger.error(
        `Exception in updateProviderServices for id ${service_id}`,
        error,
      );
      return null;
    }
  }

  async deleteProviderServices(service_id: string): Promise<boolean> {
    try {
      const { error } = await this.postgresrest
        .from('ProviderServices')
        .delete()
        .eq('service_id', service_id);

      if (error) {
        this.logger.error(`Error deleting service ${service_id}`, error);
        return false;
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Exception in deleteProviderServices for id ${service_id}`,
        error,
      );
      return false;
    }
  }
}

@Injectable()
export class TraderService {
  private readonly logger = initLogger(TraderService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createTrader(
    createTraderDto: CreateLedgerDto.CreateTraderDto,
  ): Promise<Trader | undefined> {
    const trader = new Trader();
    trader.first_name = createTraderDto.first_name;
    trader.last_name = createTraderDto.last_name;
    trader.address = createTraderDto.address;
    trader.phone = createTraderDto.phone;
    trader.email = createTraderDto.email;

    const new_trader = await this.postgresrest
      .from('Trader')
      .insert(trader)
      .single();
    if (new_trader.data) {
      return new_trader;
    } else {
      return;
    }
  }

  async findAllTraders(): Promise<Trader[]> {
    try {
      const { data, error } = await this.postgresrest.from('Trader').select();

      if (error) {
        this.logger.error('Error fetching producers', error);
        return [];
      }

      return data as Trader[];
    } catch (error) {
      this.logger.error('Exception in findAllTraders', error);
      return [];
    }
  }

  async viewTrader(trader_id: string): Promise<Trader> {
    try {
      const { data, error } = await this.postgresrest
        .from('Trader')
        .select('*')
        .eq('trader_id', trader_id)
        .single();

      if (error || !data) {
        throw new NotFoundException(`Trader ${trader_id} not found`);
      }

      return data as Trader;
    } catch (error) {
      this.logger.error(`Trader lookup failed`, { trader_id, error });
      throw error; // Let Nest handle the HTTP response
    }
  }
}

@Injectable()
export class TraderInventoryService {
  private readonly logger = initLogger(TraderInventoryService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createTraderInventory(
    createTraderInventoryDto: CreateLedgerDto.CreateTraderInventoryDto,
  ): Promise<TraderInventory | undefined> {
    const inventory = new TraderInventory();
    inventory.trader_id = createTraderInventoryDto.trader_id;
    inventory.commodity_id = createTraderInventoryDto.commodity_id;
    inventory.quantity = createTraderInventoryDto.quantity;
    inventory.unit_measurement = createTraderInventoryDto.unit_measurement;

    const new_inventory = await this.postgresrest
      .from('TraderInventory')
      .insert(inventory)
      .single();
    if (new_inventory.data) {
      return new_inventory;
    } else {
      return;
    }
  }

  async viewInventory(trader_id: string): Promise<TraderInventory[] | null> {
    try {
      const { data, error } = await this.postgresrest
        .from('TraderInventory')
        .select('*')
        .eq('trader_id', trader_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching inventory ${trader_id}`, error);
        return null;
      }

      return data as TraderInventory[];
    } catch (error) {
      this.logger.error(
        `Exception in viewInventory for id ${trader_id}`,
        error,
      );
      return null;
    }
  }

  async updateInventory(
    inventory_id: string,
    updateTraderInventoryDto: UpdateLedgerDto.UpdateTraderInventoryDto,
  ): Promise<TraderInventory | null> {
    try {
      const { data, error } = await this.postgresrest
        .from('TraderInventory')
        .update({
          quantity: updateTraderInventoryDto.quantity,
        })
        .eq('inventory_id', inventory_id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating inventory ${inventory_id}`, error);
        return null;
      }
      return data as TraderInventory;
    } catch (error) {
      this.logger.error(`Exception in updateBid for id ${inventory_id}`, error);
      return null;
    }
  }
}
