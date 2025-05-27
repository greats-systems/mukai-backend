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
import { ProviderProductsService } from '../services/provider-products.service';
import { CreateProviderProductsDto } from '../dto/create/create-provider-products.dto';
import { UpdateProviderProductsDto } from '../dto/update/update-provider-products.dto';

@Controller('provider_products')
export class ProviderProductsController {
  constructor(
    private readonly providerProductsService: ProviderProductsService,
  ) {}

  @Post()
  async create(
    @Body()
    createProviderProductsDto: CreateProviderProductsDto,
  ) {
    const response = await this.providerProductsService.createProviderProduct(
      createProviderProductsDto,
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

  @Get()
  async findAll() {
    const response = await this.providerProductsService.findAllProducts();
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

  @Get(':product_id')
  async findOne(@Param('product_id') product_id: string) {
    const response =
      await this.providerProductsService.viewProviderProducts(product_id);
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

  @Patch(':product_id')
  async update(
    @Param('product_id') product_id: string,
    @Body()
    updateProviderProductsDto: UpdateProviderProductsDto,
  ) {
    const response = await this.providerProductsService.updateProviderProducts(
      product_id,
      updateProviderProductsDto,
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

  @Delete(':product_id')
  delete(@Param('product_id') product_id: string) {
    const response =
      this.providerProductsService.deleteProviderProducts(product_id);
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
