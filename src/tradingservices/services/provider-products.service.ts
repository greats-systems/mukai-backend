/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Injectable, Logger } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest/postgresrest';
import { CreateProviderProductsDto } from '../dto/create/create-provider-products.dto';
import { UpdateProviderProductsDto } from '../dto/update/update-provider-products.dto';
import { ProviderProducts } from '../entities/provider-products.entity';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class ProviderProductsService {
  private readonly logger = initLogger(ProviderProductsService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createProviderProduct(
    createProviderProductDto: CreateProviderProductsDto,
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
        return new ErrorResponseDto(400, error.message);
      }
      return data as ProviderProducts;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllProducts(): Promise<ProviderProducts[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('ProviderProducts')
        .select('*, Provider(*)');

      if (error) {
        this.logger.error('Error fetching products', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as ProviderProducts[];
    } catch (error) {
      this.logger.error('Exception in findAllProducts', error);
      return new ErrorResponseDto(500, error);
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
        return new ErrorResponseDto(400, error.message);
      }

      return data as ProviderProducts[];
    } catch (error) {
      this.logger.error(
        `Exception in viewProviderProducts for id ${product_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
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
        return new ErrorResponseDto(400, error.message);
      }
      if (data) {
        return true;
      }
      return false;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async updateProviderProducts(
    product_id: string,
    updateProviderProductsDto: UpdateProviderProductsDto,
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
        return new ErrorResponseDto(400, error.message);
      }
      return data as ProviderProducts;
    } catch (error) {
      this.logger.error(
        `Exception in updateProviderProducts for id ${product_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
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
        return new ErrorResponseDto(400, error.message);
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Exception in deleteProviderProducts for id ${product_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }
}
