import { Injectable, Logger } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest/postgresrest';
import { ProduceModel } from '../entities/produce.entity';
import { Produce, ProduceInput } from 'src/nodes/dto/produce.dto';
import { ProduceChainCodeService } from 'src/nodes/produce_chaincode_api.service';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class ProduceService {
  private readonly logger = initLogger(ProduceService);
  constructor(private readonly postgresrest: PostgresRest, private readonly produceChainCodeService: ProduceChainCodeService) { }

  async addProduce(
    produceInput: ProduceInput,
  )
  // :Promise<Produce | ErrorResponseDto>
  {
    try {
      const produce: ProduceModel = {
        accountID: "113a543d-36e8-42a8-b434-b28e2e2becd3",
        appraisedValue: 20,
        category: "legunes",
        createdDate: "today",
        id: "113a543d-36e8-42a8-b434-b28e2e2bec00",
        imageUrl: "url",
        marketPrice: "20.0",
        name: "coffee",
        owner: "innocent",
        produceID: "113a543d-36e8-42a8-b434-b28e2e2bec00",
        produceType: "non-perishable",
        publicDescription: "coffee",
        salt: "113a543d-36e8-42a8-b434-b28e2e2becd3",
        species: "coffee",
        tradingCertificateUrl: "url",
        tradingStatus: "new-produce",
        warehouseCertificateUrl: "url",
        weight: "20 tones"
      };

      // let on_chain_actions = await this.produceChainCodeService.createProduce(produce_data)
      try {
        let data = { ...produce }
        this.logger.log('addProduce produce data', data);
        const new_commodity = await this.postgresrest
          .from('produce')
          .insert({ id: produce.id })
          .single();
        this.logger.log('addProduce body', new_commodity);
      } catch (error) {
        this.logger.error('Failed to create commodity error', error);

      }
      // if (new_commodity.data) {
      //   this.logger.log('createProduce body', new_commodity);
      //   return new_commodity;
      // } else {
      //   this.logger.error('Failed to create commodity');
      //   return new ErrorResponseDto(400, 'Failed to create commodity');
      // }
    } catch (error) {
      this.logger.error('createProduce error', error);
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async findAllProduce(): Promise<Produce[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('Produce')
        .select();

      if (error) {
        this.logger.error('Error fetching commodities', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Produce[];
    } catch (error) {
      this.logger.error('Exception in findAllCommodities', error);
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async viewCommodity(
    commodity_id: string,
  ): Promise<Produce | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('Produce')
        .select('*')
        .eq('commodity_id', commodity_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching commodity ${commodity_id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Produce;
    } catch (error) {
      this.logger.error(
        `Exception in viewCommodity for id ${commodity_id}`,
        error,
      );
      return new ErrorResponseDto(500, error.toString());
    }
  }
}
