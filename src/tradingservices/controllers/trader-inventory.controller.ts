/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TraderInventoryService } from '../services/trader-inventory.service';
import { UpdateTraderInventoryDto } from '../dto/update/update-trader-inventory.dto';
import { CreateTraderInventoryDto } from '../dto/create/create-trader-inventory.dto';

@Controller('trader_inventory')
export class TraderInventoryController {
  constructor(
    private readonly traderInventoryService: TraderInventoryService,
  ) {}
  @Post()
  async create(@Body() createTraderInventoryDto: CreateTraderInventoryDto) {
    const response = await this.traderInventoryService.createTraderInventory(
      createTraderInventoryDto,
    );
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 409) {
      throw new HttpException(response['message'], HttpStatus.CONFLICT);
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
  async findAll(@Param('trader_id') trader_id: string) {
    const response = await this.traderInventoryService.viewInventory(trader_id);
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

  @Patch(':commodity_id')
  async update(
    @Param('commodity_id') commodity_id: string,
    updateTraderInventoryDto: UpdateTraderInventoryDto,
  ) {
    const response = await this.traderInventoryService.updateInventory(
      commodity_id,
      updateTraderInventoryDto,
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
}
