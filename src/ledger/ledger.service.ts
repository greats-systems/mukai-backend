import { Injectable, Logger } from '@nestjs/common';
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
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest/postgresrest';
import * as CreateLedgerDto from './dto/create-ledger.dto';
import * as UpdateLedgerDto from './dto/update-ledger.dto';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class CommodityService {
  private readonly logger = initLogger(CommodityService);
  constructor(private readonly postgresrest: PostgresRest) { }

  async createCommodity(
    createCommodityDto: CreateLedgerDto.CreateCommodityDto,
  ): Promise<Commodity | ErrorResponseDto> {
    try {
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
        return new ErrorResponseDto(400, 'Failed to create commodity');
      }
    } catch (error) {
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async findAllCommodities(): Promise<Commodity[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('Commodity')
        .select();

      if (error) {
        this.logger.error('Error fetching commodities', error);
        return new ErrorResponseDto(500, error.toString());
      }

      return data as Commodity[];
    } catch (error) {
      this.logger.error('Exception in findAllCommodities', error);
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async viewCommodity(
    commodity_id: string,
  ): Promise<Commodity | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('Commodity')
        .select('*')
        .eq('commodity_id', commodity_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching commodity ${commodity_id}`, error);
        return new ErrorResponseDto(500, error.toString());
      }

      return data as Commodity;
    } catch (error) {
      this.logger.error(
        `Exception in viewCommodity for id ${commodity_id}`,
        error,
      );
      return new ErrorResponseDto(500, error.toString());
    }
  }
}

@Injectable()
export class ContractBidService {
  private readonly logger = initLogger(ContractBidService);
  constructor(private readonly postgresrest: PostgresRest) { }

  async createContractBid(
    createContractBidDto: CreateLedgerDto.CreateContractBidDto,
  ): Promise<ContractBid | ErrorResponseDto> {
    try {
      const provider_service = new ProviderService(this.postgresrest);
      const contract_service = new ContractService(this.postgresrest);

      // 1. Validate capacity vs quantity first
      const provider = await provider_service.viewProvider(
        createContractBidDto.provider_id,
      );
      const contract = await contract_service.viewContract(
        createContractBidDto.contract_id,
      );

      if (!provider || !contract) {
        return new ErrorResponseDto(
          404,
          'Could not find a provider or contract',
        );
      }

      // Safely get capacity with fallback
      const capacity = provider['ProviderServices'][0]['max_capacity'] ?? 0;
      const quantity = contract['quantity_kg'] ?? 0;

      console.log({ capacity, quantity });

      // 2. Check capacity requirements
      if (capacity < quantity) {
        const message =
          `${provider['first_name']} ${provider['last_name']} cannot fulfil this contract. ` +
          `Capacity short by ${quantity - capacity}kg`;

        return new ErrorResponseDto(403, message);
      }

      // 3. Check if provider has existing bid
      if (await this.viewBidByProvider(createContractBidDto.provider_id)) {
        const message = `${provider['first_name']} ${provider['last_name']} already sbmitted a bid for this contract`;
        console.warn(message);
        return new ErrorResponseDto(409, message);
      }

      // 4. Only create bid if validations pass
      const { data: newBid, error } = await this.postgresrest
        .from('ContractBid')
        .insert({
          provider_id: createContractBidDto.provider_id,
          contract_id: createContractBidDto.contract_id,
          status: createContractBidDto.status || 'pending', // Default status
        })
        .select()
        .single();

      if (error) {
        console.error(error);
        return new ErrorResponseDto(500, error.toString());
      }
      return newBid as ContractBid;
    } catch (error) {
      const message = `Failed to create contract bid: ${error}`;
      console.error(message);
      return new ErrorResponseDto(500, message);
    }
  }
  async findAllBids(): Promise<ContractBid[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('ContractBid')
        .select('*, Contract(*)');

      if (error) {
        this.logger.error('Error fetching contract bids', error);
        return new ErrorResponseDto(500, error.toString());
      }
      return data as ContractBid[];
    } catch (error) {
      this.logger.error('Exception in findAllBids', error);
      return new ErrorResponseDto(500, error.message);
    }
  }

  async viewBidByProvider(
    provider_id: string,
  ): Promise<boolean | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('ContractBid')
        .select()
        .eq('provider_id', provider_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching contract bid ${provider_id}`, error);
        return new ErrorResponseDto(500, error.toString());
      }

      if (data) {
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error(`Exception in viewBid for id ${provider_id}`, error);
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async viewBid(bid_id: string): Promise<ContractBid | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('ContractBid')
        .select('*, Contract(*)')
        .eq('bid_id', bid_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching contract bid ${bid_id}`, error);
        return new ErrorResponseDto(500, error.toString());
      }

      return data as ContractBid;
    } catch (error) {
      this.logger.error(`Exception in viewBid for id ${bid_id}`, error);
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async updateBid(
    bid_id: string,
    updateContractBidDto: UpdateLedgerDto.UpdateContractBidDto,
  ): Promise<ContractBid | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('ContractBid')
        .update({
          provider_id: updateContractBidDto.provider_id,
          status: updateContractBidDto.status,
          closing_date: updateContractBidDto.closing_date,
          award_date: updateContractBidDto.award_date,
          awarded_to: updateContractBidDto.awarded_to,
        })
        .eq('bid_id', bid_id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating bid ${bid_id}`, error);
        return new ErrorResponseDto(500, error.toString());
      }
      return data as ContractBid;
    } catch (error) {
      this.logger.error(`Exception in updateBid for id ${bid_id}`, error);
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async deleteBid(bid_id: string): Promise<boolean | ErrorResponseDto> {
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
      return new ErrorResponseDto(500, error.toString());
    }
  }
}

@Injectable()
export class ContractService {
  private readonly logger = initLogger(ContractService);
  constructor(private readonly postgresrest: PostgresRest) { }

  async createContract(
    createContractDto: CreateLedgerDto.CreateContractDto,
  ): Promise<Contract | ErrorResponseDto> {
    try {
      // A producer should create one contract at any given time (for now)
      if (await this.viewContractByProducer(createContractDto.producer_id)) {
        const message = `You already created a contract`;
        return new ErrorResponseDto(409, message);
      }
      // Start a transaction
      const { data: new_contract, error: contractError } =
        await this.postgresrest
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
        return new ErrorResponseDto(409, contractError!.toString());
      }

      // Create the associated bid
      const { error: bidError } = await this.postgresrest
        .from('ContractBid')
        .insert({
          contract_id: new_contract.contract_id, // Use the returned contract_id
          status: 'open',
        });

      if (bidError) {
        this.logger.error('Failed to create contract bid', bidError);

        // Consider rolling back the contract creation here
        return new ErrorResponseDto(
          400,
          'Contract created but failed to create bid',
        );
      }

      return new_contract as Contract;
    } catch (error) {
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async findAllContracts(): Promise<Contract[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.from('Contract').select();

      if (error) {
        this.logger.error('Error fetching contracts', error);
        return new ErrorResponseDto(400, error.message.toString());
      }

      return data as Contract[];
    } catch (error) {
      this.logger.error('Exception in findAllContracts', error);
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async viewContractByProducer(
    producer_id: string,
  ): Promise<boolean | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('Contract')
        .select('*')
        .eq('producer_id', producer_id);
      // .single();

      if (error) {
        this.logger.error(`Error fetching contract for ${producer_id}`, error);
        return new ErrorResponseDto(500, error.toString());
      }

      if (data) {
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error(
        `Exception in viewContract for id ${producer_id}`,
        error,
      );
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async viewContract(
    contract_id: string,
  ): Promise<Contract | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('Contract')
        .select('*')
        .eq('contract_id', contract_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching contract ${contract_id}`, error);
        return new ErrorResponseDto(500, error.toString());
      }

      return data as Contract;
    } catch (error) {
      this.logger.error(
        `Exception in viewContract for id ${contract_id}`,
        error,
      );
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async updateContract(
    contract_id: string,
    updateContractDto: UpdateLedgerDto.UpdateContractDto,
  ): Promise<Contract | ErrorResponseDto> {
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
        return new ErrorResponseDto(500, error.toString());
      }
      return data as Contract;
    } catch (error) {
      this.logger.error(
        `Exception in updateContract for id ${contract_id}`,
        error,
      );
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async deleteContract(
    contract_id: string,
  ): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('Contract')
        .delete()
        .eq('contract_id', contract_id);

      if (error) {
        this.logger.error(`Error deleting contract ${contract_id}`, error);
        return new ErrorResponseDto(400, error.message.toString());
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
  constructor(private readonly postgresrest: PostgresRest) { }

  async createProducer(
    createProducerDto: CreateLedgerDto.CreateProducerDto,
  ): Promise<Producer | ErrorResponseDto> {
    try {
      const producer = new Producer();
      producer.first_name = createProducerDto.first_name;
      producer.last_name = createProducerDto.last_name;
      producer.address = createProducerDto.address;
      producer.phone = createProducerDto.phone;
      producer.email = createProducerDto.email;

      const { data, error } = await this.postgresrest
        .from('Producer')
        .insert(producer)
        .single();
      if (data) {
        return data as Producer;
      } else {
        return new ErrorResponseDto(500, error.toString());
      }
    } catch (error) {
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async findAllProducers(): Promise<Producer[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.from('Producer').select();

      if (error) {
        this.logger.error('Error fetching producers', error);
        return new ErrorResponseDto(500, error.toString());
      }

      return data as Producer[];
    } catch (error) {
      this.logger.error('Exception in findAllProducers', error);
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async viewProducer(
    producer_id: string,
  ): Promise<Producer | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('Producer')
        .select('*')
        .eq('producer_id', producer_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching producer ${producer_id}`, error);
        return new ErrorResponseDto(500, error.toString());
      }

      return data as Producer;
    } catch (error) {
      this.logger.error(
        `Exception in viewProducer for id ${producer_id}`,
        error,
      );
      return new ErrorResponseDto(500, error.toString());
    }
  }
}

@Injectable()
export class ProviderService {
  private readonly logger = initLogger(ProviderService);
  constructor(private readonly postgresrest: PostgresRest) { }

  async createProvider(
    createProviderDto: CreateLedgerDto.CreateProviderDto,
  ): Promise<Provider | ErrorResponseDto> {
    try {
      const provider = new Provider();
      provider.first_name = createProviderDto.first_name;
      provider.last_name = createProviderDto.last_name;
      provider.phone = createProviderDto.phone;
      provider.email = createProviderDto.email;
      provider.product_name = createProviderDto.product_name ?? null;
      provider.product_unit_measure = createProviderDto.product_unit_measure;
      provider.product_unit_price = createProviderDto.product_unit_price;
      provider.product_max_capacity = createProviderDto.product_max_capacity;
      provider.service_name = createProviderDto.service_name ?? null;
      provider.service_unit_measure = createProviderDto.service_unit_measure;
      provider.service_unit_price = createProviderDto.service_unit_price;
      provider.service_max_capacity = createProviderDto.service_max_capacity;

      const { data: new_provider, error: providerError } =
        await this.postgresrest
          .from('Provider')
          .insert({
            first_name: provider.first_name,
            last_name: provider.last_name,
            phone: provider.phone,
            email: provider.email,
            product_name: provider.product_name,
            service_name: provider.service_name,
          })
          .select()
          .single();

      if (!new_provider || providerError) {
        console.error('Insert error:', providerError);
        return new ErrorResponseDto(400, providerError!.message); // or handle the error appropriately
      }

      // A provider must provide at least 1 product or service
      if (!provider.product_name && !provider.service_name) {
        return new ErrorResponseDto(
          422,
          'At least one product or service is required',
        );
      }

      if (provider.product_name) {
        const { error: providerProductsError } = await this.postgresrest
          .from('ProviderProducts')
          .insert({
            provider_id: new_provider.provider_id,
            product_name: createProviderDto.product_name,
            unit_measure: createProviderDto.product_unit_measure,
            unit_price: createProviderDto.product_unit_price,
            max_capacity: createProviderDto.product_max_capacity,
          })
          .select()
          .single();

        if (providerProductsError) {
          this.logger.error('Failed to create product', providerProductsError);
          return new ErrorResponseDto(400, providerProductsError.toString());
        }
      }

      if (provider.service_name) {
        const { error: providerServicesError } = await this.postgresrest
          .from('ProviderServices')
          .insert({
            provider_id: new_provider.provider_id,
            service_name: provider.service_name,
            unit_measure: provider.service_unit_measure,
            unit_price: provider.service_unit_price,
            max_capacity: provider.service_max_capacity,
          })
          .select()
          .single();

        if (providerServicesError) {
          this.logger.error('Failed to create service', providerServicesError);
          return new ErrorResponseDto(400, providerServicesError.toString());
        }
      }

      return new_provider as Provider;
    } catch (error) {
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async findAllProviders(): Promise<Provider[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('Provider')
        .select('*, ProviderProducts(*), ProviderServices(*)');

      if (error) {
        this.logger.error('Error fetching providers', error);
        return new ErrorResponseDto(500, error.toString());
      }

      return data as Provider[];
    } catch (error) {
      this.logger.error('Exception in findAllProviders', error);
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async viewProvider(
    provider_id: string,
  ): Promise<Provider | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('Provider')
        .select('*, ProviderProducts(*), ProviderServices(*)')
        .eq('provider_id', provider_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching provider ${provider_id}`, error);
        return new ErrorResponseDto(500, error.toString());
      }

      return data as Provider;
    } catch (error) {
      this.logger.error(
        `Exception in viewProvider for id ${provider_id}`,
        error,
      );
      return new ErrorResponseDto(500, error.toString());
    }
  }
}

@Injectable()
export class ProviderProductsService {
  private readonly logger = initLogger(ProviderProductsService);
  constructor(private readonly postgresrest: PostgresRest) { }

  async createProviderProduct(
    createProviderProductDto: CreateLedgerDto.CreateProviderProductsDto,
  ): Promise<ProviderProducts | ErrorResponseDto> {
    try {
      const product = new ProviderProducts();
      product.provider_id = createProviderProductDto.provider_id;
      product.product_name = createProviderProductDto.product_name;
      product.unit_measure = createProviderProductDto.unit_measure;
      product.unit_price = createProviderProductDto.unit_price;
      product.max_capacity = createProviderProductDto.max_capacity;

      // Check if the given product already exists
      if (await this.checkIfProductExists(product.provider_id)) {
        return new ErrorResponseDto(
          409,
          'You have already registered this product',
        );
      }

      const { data, error } = await this.postgresrest
        .from('ProviderProducts')
        .insert(product)
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.message.toString());
      }
      return data as ProviderProducts;
    } catch (error) {
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async findAllProducts(): Promise<ProviderProducts[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('ProviderProducts')
        .select('*, Provider(*)');

      if (error) {
        this.logger.error('Error fetching products', error);
        return new ErrorResponseDto(500, error.toString());
      }

      return data as ProviderProducts[];
    } catch (error) {
      this.logger.error('Exception in findAllProducts', error);
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async viewProviderProducts(
    product_id: string,
  ): Promise<ProviderProducts[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('ProviderProducts')
        .select('*, Provider(*)')
        .eq('product_id', product_id);

      if (error) {
        this.logger.error(`Error fetching product ${product_id}`, error);
        return new ErrorResponseDto(500, error.toString());
      }

      return data as ProviderProducts[];
    } catch (error) {
      this.logger.error(
        `Exception in viewProviderProducts for id ${product_id}`,
        error,
      );
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async checkIfProductExists(
    provider_id: string,
  ): Promise<boolean | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('ProviderProducts')
        .select()
        .eq('provider_id', provider_id)
        .single();
      if (error) {
        return new ErrorResponseDto(500, error.toString());
      }
      if (data) {
        return true;
      }
      return false;
    } catch (error) {
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async updateProviderProducts(
    product_id: string,
    updateProviderProductsDto: UpdateLedgerDto.UpdateProviderProductsDto,
  ): Promise<ProviderProducts | ErrorResponseDto> {
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
        return new ErrorResponseDto(500, error.toString());
      }
      return data as ProviderProducts;
    } catch (error) {
      this.logger.error(
        `Exception in updateProviderProducts for id ${product_id}`,
        error,
      );
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async deleteProviderProducts(
    product_id: string,
  ): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('ProviderProducts')
        .delete()
        .eq('product_id', product_id);

      if (error) {
        this.logger.error(`Error deleting product ${product_id}`, error);
        return new ErrorResponseDto(500, error.toString());
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Exception in deleteProviderProducts for id ${product_id}`,
        error,
      );
      return new ErrorResponseDto(500, error.toString());
    }
  }
}

@Injectable()
export class ProviderServicesService {
  private readonly logger = initLogger(ProviderServicesService);
  constructor(private readonly postgresrest: PostgresRest) { }

  async createProviderService(
    createProviderServiceDto: CreateLedgerDto.CreateProviderServicesDto,
  ): Promise<ProviderServices | ErrorResponseDto> {
    try {
      const service = new ProviderServices();
      service.provider_id = createProviderServiceDto.provider_id;
      service.service_name = createProviderServiceDto.service_name;
      service.unit_measure = createProviderServiceDto.unit_measure;
      service.unit_price = createProviderServiceDto.unit_price;
      service.max_capacity = createProviderServiceDto.max_capacity;

      // Check if service already exists
      if (await this.checkIfServiceExists(service.provider_id)) {
        return new ErrorResponseDto(409, 'You already registered this service');
      }

      const { data, error } = await this.postgresrest
        .from('ProviderServices')
        .insert(service)
        .single();
      if (error) {
        return new ErrorResponseDto(500, error.toString());
      }
      return data as ProviderServices;
    } catch (error) {
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async findAllServices(): Promise<ProviderServices[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('ProviderServices')
        .select('*, Provider(*)');

      if (error) {
        this.logger.error('Error fetching services', error);
        return new ErrorResponseDto(500, error.toString());
      }

      return data as ProviderServices[];
    } catch (error) {
      this.logger.error('Exception in findAllServices', error);
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async viewProviderServices(
    service_id: string,
  ): Promise<ProviderServices[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('ProviderServices')
        .select('*')
        .eq('service_id', service_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching service ${service_id}`, error);
        return new ErrorResponseDto(500, error.toString());
      }

      return data as ProviderServices[];
    } catch (error) {
      this.logger.error(
        `Exception in viewProviderService for id ${service_id}`,
        error,
      );
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async checkIfServiceExists(
    provider_id: string,
  ): Promise<boolean | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('ProviderServices')
        .select()
        .eq('provider_id', provider_id)
        .single();
      if (error) {
        return new ErrorResponseDto(500, error.toString());
      }
      if (data) {
        return true;
      }
      return false;
    } catch (error) {
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async updateProviderServices(
    service_id: string,
    updateProviderServicesDto: UpdateLedgerDto.UpdateProviderServicesDto,
  ): Promise<ProviderServices | ErrorResponseDto> {
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
        return new ErrorResponseDto(500, error.toString());
      }
      return data as ProviderServices;
    } catch (error) {
      this.logger.error(
        `Exception in updateProviderServices for id ${service_id}`,
        error,
      );
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async deleteProviderServices(
    service_id: string,
  ): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('ProviderServices')
        .delete()
        .eq('service_id', service_id);

      if (error) {
        this.logger.error(`Error deleting service ${service_id}`, error);
        return new ErrorResponseDto(500, error.toString());
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Exception in deleteProviderServices for id ${service_id}`,
        error,
      );
      return new ErrorResponseDto(500, error.toString());
    }
  }
}

@Injectable()
export class TraderService {
  private readonly logger = initLogger(TraderService);
  constructor(private readonly postgresrest: PostgresRest) { }

  async createTrader(
    createTraderDto: CreateLedgerDto.CreateTraderDto,
  ): Promise<Trader | ErrorResponseDto> {
    try {
      const trader = new Trader();
      trader.first_name = createTraderDto.first_name;
      trader.last_name = createTraderDto.last_name;
      trader.address = createTraderDto.address;
      trader.phone = createTraderDto.phone;
      trader.email = createTraderDto.email;

      const { data, error } = await this.postgresrest
        .from('Trader')
        .insert(trader)
        .single();
      if (data) {
        return data as Trader;
      } else {
        return new ErrorResponseDto(500, error.toString());
      }
    } catch (error) {
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async findAllTraders(): Promise<Trader[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.from('Trader').select();

      if (error) {
        this.logger.error('Error fetching producers', error);
        return new ErrorResponseDto(500, error.toString());
      }

      return data as Trader[];
    } catch (error) {
      this.logger.error('Exception in findAllTraders', error);
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async viewTrader(trader_id: string): Promise<Trader | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('Trader')
        .select('*')
        .eq('trader_id', trader_id)
        .single();

      if (error) {
        return new ErrorResponseDto(500, error.toString());
      }

      return data as Trader;
    } catch (error) {
      this.logger.error(`Trader lookup failed`, { trader_id, error });
      return new ErrorResponseDto(500, error.toString());
    }
  }
}

@Injectable()
export class TraderInventoryService {
  private readonly logger = initLogger(TraderInventoryService);
  constructor(private readonly postgresrest: PostgresRest) { }

  async createTraderInventory(
    createTraderInventoryDto: CreateLedgerDto.CreateTraderInventoryDto,
  ): Promise<TraderInventory | ErrorResponseDto> {
    try {
      const inventory = new TraderInventory();
      inventory.trader_id = createTraderInventoryDto.trader_id;
      inventory.commodity_id = createTraderInventoryDto.commodity_id;
      inventory.quantity = createTraderInventoryDto.quantity;
      inventory.unit_measurement = createTraderInventoryDto.unit_measurement;

      // A trader should not have duplicate commodities
      if (await this.checkIfCommodityExists(inventory.commodity_id)) {
        return new ErrorResponseDto(
          409,
          'This commodity already exists in your inventory',
        );
      }

      const { data, error } = await this.postgresrest
        .from('TraderInventory')
        .insert(inventory)
        .single();
      if (error) {
        return new ErrorResponseDto(500, error.toString());
      }
      return data as TraderInventory;
    } catch (error) {
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async viewInventory(
    trader_id: string,
  ): Promise<TraderInventory[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('TraderInventory')
        .select('*, Trader(*)')
        .eq('trader_id', trader_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching inventory ${trader_id}`, error);
        return new ErrorResponseDto(500, error.toString());
      }

      return data as TraderInventory[];
    } catch (error) {
      this.logger.error(
        `Exception in viewInventory for id ${trader_id}`,
        error,
      );
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async checkIfCommodityExists(
    commodity_id: string,
  ): Promise<boolean | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('TraderInventory')
        .select('*')
        .eq('commodity_id', commodity_id);

      if (error) {
        this.logger.error(`Error fetching inventory ${commodity_id}`, error);
        return new ErrorResponseDto(500, error.toString());
      }
      if (data) {
        return true;
      }
      return false;
    } catch (error) {
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async updateInventory(
    commodity_id: string,
    updateTraderInventoryDto: UpdateLedgerDto.UpdateTraderInventoryDto,
  ): Promise<TraderInventory | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('TraderInventory')
        .update({
          quantity: updateTraderInventoryDto.quantity,
        })
        .eq('commodity_id', commodity_id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating inventory ${commodity_id}`, error);
        return new ErrorResponseDto(500, error.toString());
      }
      return data as TraderInventory;
    } catch (error) {
      this.logger.error(
        `Exception in updateInventory for id ${commodity_id}`,
        error,
      );
      return new ErrorResponseDto(500, error.toString());
    }
  }
}
