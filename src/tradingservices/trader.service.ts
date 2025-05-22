
import { Injectable, Logger } from '@nestjs/common';
import {
  Trader,
} from '../ledger/entities/ledger.entity';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest/postgresrest';
import * as CreateLedgerDto from '../ledger/dto/create-ledger.dto';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
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
        return new ErrorResponseDto(400, error.message);
      }
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllTraders(): Promise<Trader[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.from('Trader').select();

      if (error) {
        this.logger.error('Error fetching producers', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Trader[];
    } catch (error) {
      this.logger.error('Exception in findAllTraders', error);
      return new ErrorResponseDto(500, error);
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
        return new ErrorResponseDto(400, error.message);
      }

      return data as Trader;
    } catch (error) {
      this.logger.error(`Trader lookup failed`, { trader_id, error });
      return new ErrorResponseDto(500, error);
    }
  }
}

