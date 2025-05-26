/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Injectable, Logger } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest/postgresrest';
import { Tradingservice } from '../entities/tradingservice.entity';
import { CreateTraderDto } from '../dto/create/create-trader.dto';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

type NewType = CreateTraderDto;

@Injectable()
export class TraderService {
  private readonly logger = initLogger(TraderService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createTrader(
    createTraderDto: NewType,
  ): Promise<Tradingservice | ErrorResponseDto> {
    try {
      const trader = new Tradingservice();
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
        return data as Tradingservice;
      } else {
        return new ErrorResponseDto(400, error.message);
      }
    } catch (error) {
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async findAllTraders(): Promise<Tradingservice[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.from('Trader').select();

      if (error) {
        this.logger.error('Error fetching producers', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Tradingservice[];
    } catch (error) {
      this.logger.error('Exception in findAllTraders', error);
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async viewTrader(
    trader_id: string,
  ): Promise<Tradingservice | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('Trader')
        .select('*')
        .eq('trader_id', trader_id)
        .single();

      if (error) {
        return new ErrorResponseDto(400, error.message);
      }

      return data as Tradingservice;
    } catch (error) {
      this.logger.error(`Trader lookup failed`, { trader_id, error });
      return new ErrorResponseDto(500, error.toString());
    }
  }
}
