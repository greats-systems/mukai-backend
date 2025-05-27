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
import { ContractBidService } from '../services/contract-bidding.service';
import { CreateContractBidDto } from '../dto/create/create-contract-bid.dto';
import { UpdateContractBidDto } from '../dto/update/update-contract-bid.dto';

@Controller('contract_bid')
export class ContractBidController {
  constructor(private readonly contractBidService: ContractBidService) {}
  @Post()
  async create(@Body() createContractBidDto: CreateContractBidDto) {
    const response =
      await this.contractBidService.createContractBid(createContractBidDto);
    if (response['statusCode'] == 400) {
      throw new HttpException(response['message'], HttpStatus.BAD_REQUEST);
    }

    if (response['statusCode'] == 403) {
      throw new HttpException(response['message'], HttpStatus.FORBIDDEN);
    }
    if (response['statusCode'] == 409) {
      throw new HttpException(response['message'], HttpStatus.CONFLICT);
    }
    if (response['statusCode'] == 404) {
      throw new HttpException(response['message'], HttpStatus.NOT_FOUND);
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
    const response = await this.contractBidService.findAllBids();
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

  @Get(':bid_id')
  async findOne(@Param('bid_id') bid_id: string) {
    const response = await this.contractBidService.viewBid(bid_id);
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

  @Patch(':bid_id')
  async update(
    @Param('bid_id') bid_id: string,
    @Body() updateContractBidDto: UpdateContractBidDto,
  ) {
    const response = await this.contractBidService.updateBid(
      bid_id,
      updateContractBidDto,
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

  @Delete(':bid_id')
  async delete(@Param('bid_id') bid_id: string) {
    const response = await this.contractBidService.deleteBid(bid_id);
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
