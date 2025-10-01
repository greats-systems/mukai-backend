/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
  // UseGuards,
  Query,
} from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { CreateTransactionDto } from '../dto/create/create-transaction.dto';
import {
  // ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
// import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
@Controller('transactions')
@ApiHeader({
  name: 'apikey',
  description: 'API key for authentication (insert access token)',
  required: true, // Set to true if the header is mandatory
  example:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2V4YW1wbGUuYXV0aDAuY29tLyIsImF1ZCI6Imh0dHBzOi8vYXBpLmVkY2Fyd2FyZS5jb20vY2FsZW5kYXIvdjEvIiwic3ViIjoidXNyXzEyMyIsImlhdCI6MTQ1ODc4NTc5NiwiZXhwIjoxNDU4ODcyMTk2fQ.CA7eaHjIHz5NxeIJoFK9krqaeZrPLwmMmgI_XiQiIkQ', // Optional: provide an example value
})
@ApiHeader({
  name: 'Authorization',
  description: 'Bearer token for authentication (insert access token)',
  required: true, // Set to true if the header is mandatory
  example:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2V4YW1wbGUuYXV0aDAuY29tLyIsImF1ZCI6Imh0dHBzOi8vYXBpLmVkY2Fyd2FyZS5jb20vY2FsZW5kYXIvdjEvIiwic3ViIjoidXNyXzEyMyIsImlhdCI6MTQ1ODc4NTc5NiwiZXhwIjoxNDU4ODcyMTk2fQ.CA7eaHjIHz5NxeIJoFK9krqaeZrPLwmMmgI_XiQiIkQ', // Optional: provide an example value
})
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiExcludeEndpoint()
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

  @ApiOperation({
    summary: 'Create a new transaction',
    description: 'Creates a new transaction record in the system',
  })
  @ApiBody({
    type: CreateTransactionDto,
    description: 'Transaction data to create',
  })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid input data',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
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

  @ApiExcludeEndpoint()
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

  @ApiExcludeEndpoint()
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

  @ApiOperation({
    summary: 'Get all transactions',
    description: 'Retrieves a list of all transactions in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'List of transactions retrieved successfully',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
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

  @Get('payments')
  @ApiQuery({
    name: 'wallet_id',
    required: true,
    description: 'Wallet ID to filter by',
    example: 'd1a0e4f8-32a9-4637-a725-0aa53b5c8294',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Withdrawals and Payments retrieved successfully',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  async getWithdrawalsAndPayments(
    @Query('wallet_id') wallet_id: string,
    @Query('currency') currency: string,
  ) {
    const response = await this.transactionsService.getWithdrawalsAndPayments(
      wallet_id,
      currency,
    );
    if (response instanceof ErrorResponseDto) {
      throw new HttpException(response, response.statusCode);
    }
    return response;
  }

  @Get('filter')
  @ApiOperation({
    summary: 'Filter transactions by type',
    description: 'Retrieves transactions filtered by transaction type',
  })
  @ApiQuery({
    name: 'transaction_type',
    required: true,
    description: 'Type of transaction to filter by',
    example: 'contribution',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Filtered transactions retrieved successfully',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid transaction type',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
  async filterTransaction(@Query('transaction_type') transaction_type: string) {
    const response =
      await this.transactionsService.filterTransactions(transaction_type);
    if (response instanceof ErrorResponseDto) {
      throw new HttpException(response, response.statusCode);
    }
    return response;
  }

  @ApiOperation({
    summary: 'Get transaction by ID',
    description: 'Retrieves a specific transaction by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    description: 'Transaction ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction retrieved successfully',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid transaction ID',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
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

  @Get(':sending_wallet/recent')
  async fetchMostRecentSenderTransaction(
    @Param('sending_wallet') sending_wallet: string,
  ) {
    const response =
      await this.transactionsService.fetchMostRecentSenderTransaction(
        sending_wallet,
      );
    if (response instanceof ErrorResponseDto) {
      return new HttpException(response, response.statusCode);
    }
    return response;
  }

  @ApiOperation({
    summary: 'Get contributions for a wallet',
    description:
      'Retrieves all contribution transactions for a specific wallet',
  })
  @ApiParam({
    name: 'wallet_id',
    description: 'Wallet ID to retrieve contributions for',
    example: 'wallet_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Wallet contributions retrieved successfully',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid wallet ID',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
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

  @ApiOperation({
    summary: 'Generate transaction report',
    description: 'Generates a comprehensive transaction report for a wallet',
  })
  @ApiParam({
    name: 'wallet_id',
    description: 'Wallet ID to generate report for',
    example: 'wallet_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Transaction report generated successfully',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid wallet ID',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
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

  @ApiExcludeEndpoint()
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

  @ApiExcludeEndpoint()
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

  @ApiOperation({
    summary: 'Get total USD contributions for a wallet',
    description:
      'Retrieves all contribution transactions for a specific wallet',
  })
  @ApiParam({
    name: 'wallet_id',
    description: 'Wallet ID to retrieve contributions for',
    example: 'wallet_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Wallet contributions retrieved successfully',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid wallet ID',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
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

  @ApiOperation({
    summary: 'Get total USD subscriptions for a wallet',
    description:
      'Retrieves all subscription transactions for a specific wallet',
  })
  @ApiParam({
    name: 'wallet_id',
    description: 'Wallet ID to retrieve subscriptions for',
    example: 'wallet_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Wallet subscriptions retrieved successfully',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid wallet ID',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
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

  @ApiOperation({
    summary: 'Get total ZWG subscriptions for a wallet',
    description:
      'Retrieves all subscription transactions for a specific wallet',
  })
  @ApiParam({
    name: 'wallet_id',
    description: 'Wallet ID to retrieve subscriptions for',
    example: 'wallet_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Wallet subscriptions retrieved successfully',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid wallet ID',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
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

  @ApiOperation({
    summary: 'Get total ZWG contributions for a wallet',
    description:
      'Retrieves all contribution transactions for a specific wallet',
  })
  @ApiParam({
    name: 'wallet_id',
    description: 'Wallet ID to retrieve contributions for',
    example: 'wallet_123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Wallet contributions retrieved successfully',
    type: Object,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid wallet ID',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
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
  @ApiOperation({
    summary: 'Get member total subscriptions',
    description:
      'Retrieves the total subscription amount for a specific member within a cooperative, filtered by currency',
  })
  @ApiQuery({
    name: 'coop_wallet_id',
    required: true,
    description: 'Cooperative wallet ID to filter by',
    example: 'coop_wallet_123456789',
    type: String,
  })
  @ApiQuery({
    name: 'member_wallet_id',
    required: true,
    description: 'Member wallet ID to filter by',
    example: 'member_wallet_987654321',
    type: String,
  })
  @ApiQuery({
    name: 'currency',
    required: true,
    description: 'Currency to filter subscriptions by',
    example: 'USD',
    type: String,
    enum: ['USD', 'ZWG'], // Add possible currency values if applicable
  })
  @ApiResponse({
    status: 200,
    description: 'Member total subscriptions retrieved successfully',
    type: Object,
    content: {
      'application/json': {
        example: {
          totalSubscriptions: 1500,
          currency: 'USD',
          memberWalletId: 'member_wallet_987654321',
          coopWalletId: 'coop_wallet_123456789',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid parameters',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Member or cooperative not found',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorResponseDto,
  })
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
    console.log('getMemberTotalSubscriptions response');
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

  @ApiExcludeEndpoint()
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
