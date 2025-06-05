/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Injectable, Logger } from '@nestjs/common';
import { UpdateContractDto } from '../dto/update/update-contract.dto';
import { CreateContractDto } from '../dto/create/create-contract.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { Contract } from '../entities/contract.entity';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class ContractService {
  private readonly logger = initLogger(ContractService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createContract(
    createContractDto: CreateContractDto,
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

  async test(): Promise<string | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.from('Biz').select();

      if (error) {
        this.logger.error('Error fetching contracts', error);
        console.log(error);
        return new ErrorResponseDto(400, error.message.toString());
      }

      return 'Success';
    } catch (error) {
      this.logger.error('Exception in findAllContracts', error);
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async findAllContracts(): Promise<Contract[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.from('Contract').select();

      if (error) {
        this.logger.error('Error fetching contracts', error);
        console.log(error);
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
    updateContractDto: UpdateContractDto,
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
