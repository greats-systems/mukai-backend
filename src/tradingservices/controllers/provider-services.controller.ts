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
import { ProviderServicesService } from '../services/provider-services.service';
import { CreateProviderServicesDto } from '../dto/create/create-provider-services.dto';
import { UpdateProviderServicesDto } from '../dto/update/update-provider-services.dto';

@Controller('provider_services')
export class ProviderServicesController {
  constructor(
    private readonly providerServicesService: ProviderServicesService,
  ) {}

  @Post()
  async create(
    @Body()
    createProviderServicesDto: CreateProviderServicesDto,
  ) {
    const response = await this.providerServicesService.createProviderService(
      createProviderServicesDto,
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
    const response = await this.providerServicesService.findAllServices();
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

  @Get(':service_id')
  async findOne(@Param('service_id') service_id: string) {
    const response =
      await this.providerServicesService.viewProviderServices(service_id);
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

  @Patch(':service_id')
  async update(
    @Param('service_id') service_id: string,
    @Body()
    updateProviderServicesDto: UpdateProviderServicesDto,
  ) {
    const response = await this.providerServicesService.updateProviderServices(
      service_id,
      updateProviderServicesDto,
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

  @Delete(':service_id')
  async delete(@Param('service_id') service_id: string) {
    const response =
      await this.providerServicesService.deleteProviderServices(service_id);
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
