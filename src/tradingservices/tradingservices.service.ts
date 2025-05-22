import { Injectable } from '@nestjs/common';
import { CreateTradingserviceDto } from './dto/create-tradingservice.dto';
import { UpdateTradingserviceDto } from './dto/update-tradingservice.dto';

@Injectable()
export class TradingservicesService {
  create(createTradingserviceDto: CreateTradingserviceDto) {
    return 'This action adds a new tradingservice';
  }

  findAll() {
    return `This action returns all tradingservices`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tradingservice`;
  }

  update(id: number, updateTradingserviceDto: UpdateTradingserviceDto) {
    return `This action updates a #${id} tradingservice`;
  }

  remove(id: number) {
    return `This action removes a #${id} tradingservice`;
  }
}
