/* eslint-disable @typescript-eslint/no-unsafe-argument */

import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { CreateProviderDto } from '../dto/create/create-provider.dto';
import { ProviderService } from '../services/provider.service';

@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Post()
  async create(@Body() createProviderDto: CreateProviderDto) {
    const response =
      await this.providerService.createProvider(createProviderDto);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }
    if (response['statusCode'] == 409) {
      throw new HttpException(response['message'], HttpStatus.CONFLICT);
    }
    if (response['statusCode'] == 422) {
      throw new HttpException(
        response['message'],
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
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
    const response = await this.providerService.findAllProviders();
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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await this.providerService.viewProvider(id);
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
