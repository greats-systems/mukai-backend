/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateSpendingConditionsDto } from '../dto/create/create-spending-conditions.dto';
import { UpdateSpendingConditionsDto } from '../dto/update/update-spending-conditions.dto';
import { SpendingConditions } from '../entities/spending-conditions.entity';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class SpendingConditionsService {
  private readonly logger = initLogger(SpendingConditionsService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createSpendingConditions(
    createSpendingConditionsDto: CreateSpendingConditionsDto,
  ): Promise<SpendingConditions | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('spending_conditions')
        .insert(createSpendingConditionsDto)
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as SpendingConditions;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllSpendingConditions(): Promise<
    SpendingConditions[] | ErrorResponseDto
  > {
    try {
      const { data, error } = await this.postgresrest
        .from('spending_conditions')
        .select()
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching spending_conditions', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as SpendingConditions[];
    } catch (error) {
      this.logger.error('Exception in findAllSpendingConditions', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewSpendingConditions(
    wallet_id: string,
  ): Promise<SpendingConditions[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('spending_conditions')
        .select()
        .eq('wallet_id', wallet_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching group ${wallet_id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as SpendingConditions[];
    } catch (error) {
      this.logger.error(
        `Exception in viewSpendingConditions for id ${wallet_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async updateSpendingConditions(
    wallet_id: string,
    updateSpendingConditionsDto: UpdateSpendingConditionsDto,
  ): Promise<SpendingConditions | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('spending_conditions')
        .update(updateSpendingConditionsDto)
        .eq('wallet_id', wallet_id)
        .select()
        .single();
      if (error) {
        this.logger.error(
          `Error updating spending_conditions ${wallet_id}`,
          error,
        );
        return new ErrorResponseDto(400, error.message);
      }
      return data as SpendingConditions;
    } catch (error) {
      this.logger.error(
        `Exception in updateSpendingConditions for id ${wallet_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteSpendingConditions(
    id: string,
  ): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('spending_conditions')
        .delete()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error deleting group ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Exception in deleteSpendingConditions for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }
}
