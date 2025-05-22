import { Injectable, Logger } from '@nestjs/common';
import {
  Commodity,
} from '../ledger/entities/ledger.entity';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest/postgresrest';
import * as CreateLedgerDto from '../ledger/dto/create-ledger.dto';

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
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllCommodities(): Promise<Commodity[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('Commodity')
        .select();

      if (error) {
        this.logger.error('Error fetching commodities', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Commodity[];
    } catch (error) {
      this.logger.error('Exception in findAllCommodities', error);
      return new ErrorResponseDto(500, error);
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
        return new ErrorResponseDto(400, error.message);
      }

      return data as Commodity;
    } catch (error) {
      this.logger.error(
        `Exception in viewCommodity for id ${commodity_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }
}
