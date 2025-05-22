
import { Injectable, Logger } from '@nestjs/common';
import {
  TraderInventory,
} from '../ledger/entities/ledger.entity';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest/postgresrest';
import * as CreateLedgerDto from '../ledger/dto/create-ledger.dto';
import * as UpdateLedgerDto from '../ledger/dto/update-ledger.dto';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
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
        return new ErrorResponseDto(400, error.message);
      }
      return data as TraderInventory;
    } catch (error) {
      return new ErrorResponseDto(500, error);
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
        return new ErrorResponseDto(400, error.message);
      }

      return data as TraderInventory[];
    } catch (error) {
      this.logger.error(
        `Exception in viewInventory for id ${trader_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
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
        return new ErrorResponseDto(400, error.message);
      }
      return data as TraderInventory;
    } catch (error) {
      this.logger.error(
        `Exception in updateInventory for id ${commodity_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }
}
