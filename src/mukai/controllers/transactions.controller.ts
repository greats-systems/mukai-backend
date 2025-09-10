/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { CreateTransactionDto } from '../dto/create/create-transaction.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('up-to-date')
  async hasPaidSubscription(@Body() subsParams: object) {
    const response = await this.transactionsService.hasPaidSubscription(
      subsParams['sending_wallet'],
      subsParams['year'],
      subsParams['month'],
    );

    if (response['statusCode'] === 400) {
      throw new HttpException(
        response['message'] ?? 'Bad request',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'] ?? 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    const response =
      await this.transactionsService.createTransaction(createTransactionDto);

    if (response['statusCode'] === 400) {
      throw new HttpException(
        response['message'] ?? 'Bad request',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'] ?? 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Post('smilepay')
  async createSmilePayTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    const response =
      await this.transactionsService.createSmilePayTransaction(
        createTransactionDto,
      );

    if (response['statusCode'] === 400) {
      throw new HttpException(
        response['message'] ?? 'Bad request',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'] ?? 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Post('p2p')
  async createP2PTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    const response =
      await this.transactionsService.createP2PTransaction(createTransactionDto);

    if (response['statusCode'] === 400) {
      throw new HttpException(
        response['message'] ?? 'Bad request',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (response['statusCode'] === 500) {
      throw new HttpException(
        response['message'] ?? 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return response;
  }

  @Get()
  async findAll() {
    const response = await this.transactionsService.findAllTransactions();
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

  @Get('filter')
  async filterTransaction(@Query('transaction_type') transaction_type: string) {
    const response =
      await this.transactionsService.filterTransactions(transaction_type);
    if (response instanceof ErrorResponseDto) {
      throw new HttpException(response, response.statusCode);
    }
    return response;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const response = await this.transactionsService.viewTransaction(id);

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

  @Get('contributions/:wallet_id')
  async viewWalletContributions(@Param('wallet_id') wallet_id: string) {
    const response =
      await this.transactionsService.viewWalletContributions(wallet_id);

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

  @Get('report/:wallet_id')
  async generateTransactionReport(@Param('wallet_id') wallet_id: string) {
    const response =
      await this.transactionsService.generateTransactionReport(wallet_id);

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

  @Get('report/individual/:wallet_id')
  async generateUserTransactionReport(@Param('wallet_id') wallet_id: string) {
    const response =
      await this.transactionsService.generateUserTransactionReport(wallet_id);

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

  @Get('report/coop/:wallet_id')
  async generateCoopTransactionReport(@Param('wallet_id') wallet_id: string) {
    const response =
      await this.transactionsService.generateCoopTransactionReport(wallet_id);

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

  @Get('contributions/:wallet_id/sum')
  async getCoopTotalContributions(@Param('wallet_id') wallet_id: string) {
    const response =
      await this.transactionsService.getCoopTotalContributions(wallet_id);

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

  @Get('subscriptions/:wallet_id/sum')
  async getCoopTotalSubscriptions(@Param('wallet_id') wallet_id: string) {
    const response =
      await this.transactionsService.getCoopTotalSubscriptions(wallet_id);
    console.log('getCoopTotalSubscriptions response');
    console.log(response);
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

  @Get('subscriptions/:wallet_id/sum/zwg')
  async getCoopTotalSubscriptionsZWG(@Param('wallet_id') wallet_id: string) {
    const response =
      await this.transactionsService.getCoopTotalSubscriptionsZWG(wallet_id);
    console.log('getCoopTotalSubscriptionsZWG response');
    console.log(response);
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

  @Get('contributions/:wallet_id/sum/zwg')
  async getCoopTotalContributionsZWG(@Param('wallet_id') wallet_id: string) {
    const response =
      await this.transactionsService.getCoopTotalContributionsZWG(wallet_id);
    console.log('getCoopTotalContributionsZWG response');
    console.log(response);
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
  @Get('subscriptions/filter')
  async getMemberTotalSubscriptions(
    @Query('coop_wallet_id') coop_wallet_id: string,
    @Query('member_wallet_id') member_wallet_id: string,
    @Query('currency') currency: string,
  ) {
    const response = await this.transactionsService.getMemberTotalSubscriptions(
      coop_wallet_id,
      member_wallet_id,
      currency,
    );
    console.log('getCoopTotalSubscriptions response');
    console.log(response);
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

  @Get(':wallet_id/:category')
  async getCoopTotalsByCategory(
    @Param('wallet_id') wallet_id: string,
    @Param('category') category: string,
  ) {
    const response = await this.transactionsService.getCoopTotalsByCategory(
      wallet_id,
      category,
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
}
