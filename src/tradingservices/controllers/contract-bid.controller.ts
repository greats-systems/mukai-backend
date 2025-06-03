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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ContractBidService } from '../services/contract-bidding.service';
import { CreateContractBidDto } from '../dto/create/create-contract-bid.dto';
import { UpdateContractBidDto } from '../dto/update/update-contract-bid.dto';
import { ContractBid } from '../entities/contract-bid.entity';
// import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

@ApiTags('ContractBids')
@Controller('contract_bid')
export class ContractBidController {
  constructor(private readonly contractBidService: ContractBidService) {}
  @Post()
  @ApiOperation({ summary: 'Create a new contract bid' })
  @ApiBody({ type: CreateContractBidDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'ContractBid created successfully',
    type: ContractBid,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
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
  @ApiOperation({ summary: 'Get all contract bids' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all contract bids',
    type: [ContractBid],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
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
  @ApiOperation({ summary: 'Get a specific contract bid' })
  @ApiParam({
    name: 'bid_id',
    type: String,
    description: 'Bid ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bid details',
    type: ContractBid,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Bid not found',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Server error',
  })
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
  @ApiOperation({ summary: 'Delete a contract bid' })
  @ApiParam({
    name: 'bid_id',
    type: String,
    description: 'UUID of the bid to delete',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Bid deleted successfully',
    type: Boolean,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid bid ID',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  })
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
