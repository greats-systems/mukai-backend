/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProduceService } from '../services/produce.service';
import { ProduceInput, ProduceResponse } from 'src/nodes/dto/produce.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';


@ApiTags('produce')
@Controller('produce')
export class ProduceController {
  constructor(private readonly produceService: ProduceService) { }
  @Post('create')
  // @ApiOperation({ summary: 'Create a new produce' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'The produce has been successfully created.',
  //   type: ProduceResponse
  // })
  async create(@Body() produceInput: any) {
    const response =
      await this.produceService.addProduce(produceInput);

    // if (response['statusCode'] == 400) {
    //   throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    // }
    // if (response['statusCode'] == 409) {
    //   throw new HttpException(response['message'], HttpStatus.CONFLICT);
    // }
    // if (response['statusCode'] == 500) {
    //   throw new HttpException(
    //     response['message'],
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
    return response;
  }

  @Get()
  async findAll() {
    const response = await this.produceService.findAllProduce();
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
  @Get(':commodity_id')
  async findOne(@Param('commidity_id') commodity_id: string) {
    const response = await this.produceService.viewCommodity(commodity_id);
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
