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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiExcludeController,
} from '@nestjs/swagger';
// import { WalletTransaction } from 'typeorm';
import { WalletTransactionService } from '../services/wallet-transaction.service';
import { CreateWalletTransactionDto } from '../dto/create/create-wallet-transaction.dto';
import { WalletTransaction } from '../entities/wallet-transactions.entity';

@ApiTags('WalletTransaction')
@ApiExcludeController()
@Controller('zb_wallet_transactions')
export class WalletTransactionController {
  constructor(private readonly transactionService: WalletTransactionService) {}

  @Post()
  @ApiOperation({ summary: 'Create transaction' })
  @ApiBody({ type: CreateWalletTransactionDto })
  @ApiResponse({
    status: 201,
    description: 'transaction created successfully',
    type: WalletTransaction,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async create(@Body() createWalletTransactionDto: CreateWalletTransactionDto) {
    const response = await this.transactionService.createWalletTransaction(
      createWalletTransactionDto,
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

  @Get()
  @ApiOperation({ summary: 'List all zb_wallet_transactions' })
  @ApiResponse({
    status: 200,
    description: 'Array of zb_wallet_transactions',
    type: [WalletTransaction],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findAll() {
    const response = await this.transactionService.findAllWalletTransactions();
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
  @ApiOperation({ summary: 'Get transaction details' })
  @ApiParam({
    name: 'id',
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'transaction ID',
  })
  @ApiResponse({
    status: 200,
    description: 'transaction details',
    type: WalletTransaction,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid ID format',
  })
  @ApiResponse({
    status: 404,
    description: 'transaction not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findOne(@Param('id') id: string) {
    const response = await this.transactionService.viewWalletTransaction(id);
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
