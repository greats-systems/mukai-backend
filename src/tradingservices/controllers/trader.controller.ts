/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { TraderService } from '../services/trader.service';
import { CreateTraderDto } from '../dto/create/create-trader.dto';

@Controller('trader')
export class TraderController {
  constructor(private readonly traderService: TraderService) {}

  @Post()
  async create(@Body() createTraderDto: CreateTraderDto) {
    const response = await this.traderService.createTrader(createTraderDto);
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
    const response = await this.traderService.findAllTraders();
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

  @Get(':trader_id') // This expects a PATH parameter
  async findOne(@Param('trader_id') trader_id: string) {
    const response = await this.traderService.viewTrader(trader_id);
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
