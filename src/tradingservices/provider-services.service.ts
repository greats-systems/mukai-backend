
import { Injectable, Logger } from '@nestjs/common';
import {
  ProviderServices,
} from '../ledger/entities/ledger.entity';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest/postgresrest';
import * as CreateLedgerDto from '../ledger/dto/create-ledger.dto';
import * as UpdateLedgerDto from '../ledger/dto/update-ledger.dto';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
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
        return new ErrorResponseDto(400, error.message);
      }
      return data as ProviderServices;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllServices(): Promise<ProviderServices[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('ProviderServices')
        .select('*, Provider(*)');

      if (error) {
        this.logger.error('Error fetching services', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as ProviderServices[];
    } catch (error) {
      this.logger.error('Exception in findAllServices', error);
      return new ErrorResponseDto(500, error);
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
        return new ErrorResponseDto(400, error.message);
      }

      return data as ProviderServices[];
    } catch (error) {
      this.logger.error(
        `Exception in viewProviderService for id ${service_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
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
        return new ErrorResponseDto(400, error.message);
      }
      return data as ProviderServices;
    } catch (error) {
      this.logger.error(
        `Exception in updateProviderServices for id ${service_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
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
        return new ErrorResponseDto(400, error.message);
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Exception in deleteProviderServices for id ${service_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }
}
