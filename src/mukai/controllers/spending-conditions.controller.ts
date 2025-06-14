/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateSpendingConditionsDto } from '../dto/create/create-spending-conditions.dto';
import { UpdateSpendingConditionsDto } from '../dto/update/update-spending-conditions.dto';
import { SpendingConditionsService } from '../services/spending-conditions.service';

@Controller('groups')
export class SpendingConditionsController {
  constructor(private readonly groupsService: SpendingConditionsService) {}

  @Post()
  async create(
    @Body() createSpendingConditionsDto: CreateSpendingConditionsDto,
  ) {
    const response = await this.groupsService.createSpendingConditions(
      createSpendingConditionsDto,
    );
    /*
    if (response['statusCode'] === 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(response['message'], HttpStatus.INTERNAL_SERVER_ERROR);
    }
      */
    return response;
  }

  @Get()
  async findAll() {
    const response = await this.groupsService.findAllSpendingConditions();
    if (response['statusCode'] === 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await this.groupsService.viewSpendingConditions(id);
    if (response['statusCode'] === 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSpendingConditionsDto: UpdateSpendingConditionsDto,
  ) {
    const response = await this.groupsService.updateSpendingConditions(
      id,
      updateSpendingConditionsDto,
    );
    if (response['statusCode'] === 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const response = await this.groupsService.deleteSpendingConditions(id);
    if (response['statusCode'] === 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'],
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }
}
