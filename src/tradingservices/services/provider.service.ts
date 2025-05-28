/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Injectable, Logger } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest/postgresrest';
import { CreateProviderDto } from '../dto/create/create-provider.dto';
import { Provider } from '../entities/provider.entity';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class ProviderService {
  private readonly logger = initLogger(ProviderService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createProvider(
    createProviderDto: CreateProviderDto,
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
          return new ErrorResponseDto(400, providerProductsError.message);
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
          return new ErrorResponseDto(400, providerServicesError.message);
        }
      }

      return new_provider as Provider;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllProviders(): Promise<Provider[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('Provider')
        .select('*, ProviderProducts(*), ProviderServices(*)');

      if (error) {
        this.logger.error('Error fetching providers', error);
        return new ErrorResponseDto(400, error.message);
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
        return new ErrorResponseDto(400, error.message);
      }

      return data as Provider;
    } catch (error) {
      this.logger.error(
        `Exception in viewProvider for id ${provider_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }
}
