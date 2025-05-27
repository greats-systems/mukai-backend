/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { Injectable, Logger } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateTradingserviceDto } from '../dto/create/create-tradingservice.dto';
import { UpdateTradingserviceDto } from '../dto/update-tradingservice.dto';
import { Tradingservice } from '../entities/tradingservice.entity';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class TradingservicesService {
  private readonly logger = initLogger(TradingservicesService);
  constructor(private readonly postgresrest: PostgresRest) {}
  async create(
    createTradingserviceDto: CreateTradingserviceDto,
  ): Promise<Tradingservice | ErrorResponseDto> {
    try {
      const trader = new Tradingservice();
      trader.first_name = createTradingserviceDto.first_name;
      trader.last_name = createTradingserviceDto.last_name;
      trader.address = createTradingserviceDto.address;
      trader.phone = createTradingserviceDto.phone;
      trader.email = createTradingserviceDto.email;

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

  async findAll(): Promise<Tradingservice[] | ErrorResponseDto> {
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

  async findOne(trader_id: string): Promise<Tradingservice | ErrorResponseDto> {
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

  async update(
    trader_id: string,
    updateTradingserviceDto: UpdateTradingserviceDto,
  ): Promise<Tradingservice | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('Trader')
        .update({
          address: updateTradingserviceDto.address,
          phone: updateTradingserviceDto.phone,
          email: updateTradingserviceDto.email,
        })
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

  async remove(trader_id: string): Promise<boolean | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('Trader')
        .delete()
        .eq('trader_id', trader_id);

      if (error) {
        return new ErrorResponseDto(400, error.message);
      }

      return true;
    } catch (error) {
      this.logger.error(`Trader lookup failed`, { trader_id, error });
      return new ErrorResponseDto(500, error.toString());
    }
  }
}
