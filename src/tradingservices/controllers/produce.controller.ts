/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Patch,
  Delete,
} from '@nestjs/common';
import { ProduceService } from '../services/produce.service';
import { ProduceInput, ProduceResponse, UpdateProduceDto } from 'src/nodes/dto/produce.dto';
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
  @Get(':produce_id')
  async findOne(@Param('produce_id') produce_id: string) {
    const response = await this.produceService.viewProduce(produce_id);
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

  @Patch(':produce_id')
  async update(@Param('produce_id') produce_id: string, @Body() updateProduceDto: UpdateProduceDto) {
    const response = await this.produceService.updateProduce(produce_id, updateProduceDto)
    return response
  }

  @Delete(':produce_id')
  async delete(@Param(':produce_id') produce_id: string) {
    const response = await this.produceService.deleteProduce(produce_id)
    return response
  }
}
