/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateCooperativeDto } from '../dto/create/create-cooperative.dto';
import { UpdateCooperativeDto } from '../dto/update/update-cooperative.dto';
import { Cooperative } from '../entities/cooperative.entity';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class CooperativesService {
  private readonly logger = initLogger(CooperativesService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createCooperative(
    createCooperativeDto: CreateCooperativeDto,
  ): Promise<Cooperative | ErrorResponseDto> {
    try {
      /*
      const Cooperative = new Cooperative();

      Cooperative.id ?: string;
      Cooperative.handling_smart_contract ?: string;
      Cooperative.is_collateral_required ?: boolean;
      Cooperative.requesting_account ?: string;
      Cooperative.offering_account ?: string;
      Cooperative.collateral_Cooperative_id ?: string;
      Cooperative.payment_due ?: string;
      Cooperative.payment_terms ?: string;
      Cooperative.amount ?: string;
      Cooperative.payments_handling_wallet_id ?: string;
      Cooperative.collateral_Cooperative_handler_id ?: string;
      Cooperative.collateral_Cooperative_handler_fee ?: string;

      Cooperative.provider_id = createCooperativeDto.provider_id;
      Cooperative.Cooperative_name = createCooperativeDto.Cooperative_name;
      Cooperative.unit_measure = createCooperativeDto.unit_measure;
      Cooperative.unit_price = createCooperativeDto.unit_price;
      Cooperative.max_capacity = createCooperativeDto.max_capacity;

      // Check if the given Cooperative already exists
      if (await this.checkIfProductExists(Cooperative.provider_id)) {
        return new ErrorResponseDto(
          409,
          'You have already registered this Cooperative',
        );
      }
        */

      const { data, error } = await this.postgresrest
        .from('cooperatives')
        .insert(createCooperativeDto)
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as Cooperative;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllCooperatives(): Promise<Cooperative[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperatives')
        .select();

      if (error) {
        this.logger.error('Error fetching Cooperatives', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Cooperative[];
    } catch (error) {
      this.logger.error('Exception in findAllCooperatives', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewCooperative(id: string): Promise<Cooperative | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperatives')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error fetching Cooperative ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      if (!data) {
        return new ErrorResponseDto(404, `Cooperative with id ${id} not found`);
      }

      return data as Cooperative;
    } catch (error) {
      this.logger.error(`Exception in viewCooperative for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async updateCooperative(
    id: string,
    updateCooperativeDto: UpdateCooperativeDto,
  ): Promise<Cooperative | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperatives')
        .update(updateCooperativeDto)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating Cooperatives ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as Cooperative;
    } catch (error) {
      this.logger.error(`Exception in updateCooperative for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteCooperative(id: string): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('cooperatives')
        .delete()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error deleting Cooperative ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return true;
    } catch (error) {
      this.logger.error(`Exception in deleteCooperative for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }
}
