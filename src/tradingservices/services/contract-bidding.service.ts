/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Injectable, Logger } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest/postgresrest';
import { ProviderService } from './provider.service';
import { ContractService } from './contracts.service';
import { CreateContractBidDto } from '../dto/create/create-contract-bid.dto';
import { UpdateContractBidDto } from '../dto/update/update-contract-bid.dto';
import { ContractBid } from '../entities/contract-bid.entity';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class ContractBidService {
  private readonly logger = initLogger(ContractBidService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createContractBid(
    createContractBidDto: CreateContractBidDto,
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
        return new ErrorResponseDto(400, error.message);
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
        return new ErrorResponseDto(400, error.message);
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
        return new ErrorResponseDto(400, error.message);
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
        return new ErrorResponseDto(400, error.message);
      }

      return data as ContractBid;
    } catch (error) {
      this.logger.error(`Exception in viewBid for id ${bid_id}`, error);
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async updateBid(
    bid_id: string,
    updateContractBidDto: UpdateContractBidDto,
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
        return new ErrorResponseDto(400, error.message);
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
