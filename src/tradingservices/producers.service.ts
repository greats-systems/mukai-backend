
import { Injectable, Logger } from '@nestjs/common';
import {
  Producer,
} from '../ledger/entities/ledger.entity';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest/postgresrest';
import * as CreateLedgerDto from '../ledger/dto/create-ledger.dto';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}


@Injectable()
export class ProducerService {
  private readonly logger = initLogger(ProducerService);
  constructor(private readonly postgresrest: PostgresRest) { }

  async createProducer(
    createProducerDto: CreateLedgerDto.CreateProducerDto,
  ): Promise<Producer | ErrorResponseDto> {
    try {
      const producer = new Producer();
      producer.first_name = createProducerDto.first_name;
      producer.last_name = createProducerDto.last_name;
      producer.address = createProducerDto.address;
      producer.phone = createProducerDto.phone;
      producer.email = createProducerDto.email;

      const { data, error } = await this.postgresrest
        .from('Producer')
        .insert(producer)
        .single();
      if (data) {
        return data as Producer;
      } else {
        return new ErrorResponseDto(400, error.message);
      }
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllProducers(): Promise<Producer[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.from('Producer').select();

      if (error) {
        this.logger.error('Error fetching producers', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Producer[];
    } catch (error) {
      this.logger.error('Exception in findAllProducers', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewProducer(
    producer_id: string,
  ): Promise<Producer | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('Producer')
        .select('*')
        .eq('producer_id', producer_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching producer ${producer_id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Producer;
    } catch (error) {
      this.logger.error(
        `Exception in viewProducer for id ${producer_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }
}
