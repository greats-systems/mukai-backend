/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateTradingserviceDto } from '../dto/create/create-tradingservice.dto';
import { UpdateTradingserviceDto } from '../dto/update-tradingservice.dto';
import { TradingservicesService } from '../services/tradingservices.service';

@Controller('tradingservices')
export class TradingservicesController {
  constructor(
    private readonly tradingservicesService: TradingservicesService,
  ) {}

  @Post()
  async create(@Body() createTraderDto: CreateTradingserviceDto) {
    const response = await this.tradingservicesService.create(createTraderDto);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Get()
  async findAll() {
    const response = await this.tradingservicesService.findAll();
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Get(':trader_id')
  async findOne(@Param('trader_id') trader_id: string) {
    const response = await this.tradingservicesService.findOne(trader_id);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Patch(':trader_id')
  async update(
    @Param('trader_id') trader_id: string,
    @Body() updateTradingServiceDto: UpdateTradingserviceDto,
  ) {
    const response = await this.tradingservicesService.update(
      trader_id,
      updateTradingServiceDto,
    );
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Delete(':trader_id')
  async remove(@Param('trader_id') trader_id: string) {
    const response = await this.tradingservicesService.remove(trader_id);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }
}
