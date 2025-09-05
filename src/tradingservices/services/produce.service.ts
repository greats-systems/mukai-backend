import { ErrorResponseDto } from './../../common/dto/error-response.dto';
import { UpdateProduceDto } from './../../nodes/dto/produce.dto';
import { Injectable, Logger } from '@nestjs/common';
// import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
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
  :Promise<Produce | ErrorResponseDto>
  {
    try {
      const produce: ProduceModel = {
        accountID: "113a543d-36e8-42a8-b434-b28e2e2becd3",
        appraisedValue: 20,
        category: "legumes",
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

      // let on_chain_actions = await this.produceChainCodeService.createProduce(produce)
      let _data = { ...produce }
        this.logger.log('addProduce produce data', _data);
        const { data, error } = await this.postgresrest
          .from('produce')
          .insert(produceInput)
          .single();
        this.logger.log('addProduce body', data);
        if(error){
          this.logger.error('Failed to create commodity');
          return new ErrorResponseDto(400, 'Failed to create commodity');
        }
        this.logger.log('createProduce body', data);
        return data as Produce;
      
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
        this.logger.error('Error fetching produce', error);
        return new ErrorResponseDto(400, error.details);
      }

      return data as Produce[];
    } catch (error) {
      this.logger.error('Exception in findAllProduce', error);
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async viewProduce(
    produceID: string,
  ): Promise<Produce | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('produce')
        .select('*')
        .eq('produce_id', produceID)
        .single();

      if (error) {
        this.logger.error(`Error fetching produce ${produceID}`, error);
        return new ErrorResponseDto(400, error.details);
      }

      return data as Produce;
    } catch (error) {
      this.logger.error(
        `Exception in viewCommodity for id ${produceID}`,
        error,
      );
      return new ErrorResponseDto(500, error.toString());
    }
  }

  async updateProduce(
    produceID: string, 
    updateProduceDto: UpdateProduceDto): 
    Promise<Produce | ErrorResponseDto> {
    try{
      const { data, error } = await this.postgresrest
      .from('produce')
      .update({
        marketprice: updateProduceDto.marketPrice,
        tradingstatus: updateProduceDto.tradingStatus
      })
      .eq('produce_id', produceID)

      if(error) {
        return new ErrorResponseDto(400, error.message.toString())
      }
      return data! as Produce;
    }
    catch(error){
      this.logger.error(
        `Exception in updateProduce for id ${produceID}`,
        error,
      );
      return new ErrorResponseDto(500, error.message.toString())
    }
  }

  async deleteProduce(produceID: string): Promise<string|ErrorResponseDto > {
    try{
      const { data, error } = await this.postgresrest
      .from('produce')
      .delete()
      .eq('produce_id', produceID)
      if(error) {
        return new ErrorResponseDto(400, error.toString())
      }
      return 'Produce deleted successfully!'
    }
    catch(error){
      this.logger.error(
        `Exception in deleteProduce for id ${produceID}`,
        error,
      );
      return new ErrorResponseDto(500, error.toString())
    }
  }
}
