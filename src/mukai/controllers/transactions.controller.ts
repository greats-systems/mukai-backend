/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
  Req,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';
import { CreateTransactionDto } from '../dto/create/create-transaction.dto';
import {
  ApiBearerAuth,
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
import { MunicipalityBillRequest } from 'src/common/zb_smilecash_wallet/requests/municipality-bill.request';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';

// @UseGuards(JwtAuthGuard)
// @ApiBearerAuth()
@Controller('transactions')
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

  // @ApiExcludeEndpoint()
  @Post('p2p')
  async createP2PTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
    @Req() req,
  ) {
    const response = await this.transactionsService.createP2PTransaction(
      createTransactionDto,
      req.user.sub,
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

  @Post('bill-payment')
  async payMunicipalityBill(@Body() mbDto: MunicipalityBillRequest) {
    const response = await this.transactionsService.payMunicipalityBill(mbDto);

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

  @Get('subs-and-contributions')
  @ApiOperation({
    summary: 'Get member subs and contributions transactions',
    description:
      'Retrieves a list of all member subs and contributions transactions in the system',
  })
  @ApiQuery({
    name: 'member_wallet_id',
    description: 'Member wallet UUID',
  })
  @ApiQuery({
    name: 'coop_wallet_id',
    description: 'Cooperative wallet UUID',
  })
  @ApiResponse({
    status: 200,
    description:
      'List of member subs and contributions transactions retrieved successfully',
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
  async fetchUserSubsAndContributions(
    @Query('coop_wallet_id') coop_wallet_id: string,
    @Query('member_wallet_id') member_wallet_id: string,
    @Req() req,
    @Headers() headers,
  ) {
    const response =
      await this.transactionsService.fetchUserSubsAndContributions(
        member_wallet_id,
        coop_wallet_id,
        req.user.sub,
        headers['x-platform'],
      );
    if (response instanceof ErrorResponseDto) {
      return new HttpException(response, response.statusCode);
    }
    return response;
  }

  @Get('individual/:wallet_id')
  @ApiOperation({
    summary: 'Get all user transactions',
    description: 'Retrieves a list of all user transactions in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'List of user transactions retrieved successfully',
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
  async findUserTransactions(
    @Param('wallet_id') wallet_id: string,
    @Req() req,
    @Headers() headers,
  ) {
    const response = await this.transactionsService.findUserTransactions(
      wallet_id,
      req.user.sub,
      headers['x-platform'],
    );
    if (response instanceof ErrorResponseDto) {
      return new HttpException(
        response.message ?? 'An error occurred',
        response.statusCode,
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
  @Get('earnings')
  @ApiOperation({
    summary: 'Get cooperative earnings by currency',
    description: 'Retrieves cooperative earnings filtered by currency',
  })
  @ApiQuery({
    name: 'currency',
    description: 'Currency to filter earnings by',
  })
  @ApiResponse({
    status: 200,
    description: 'Cooperative earnings retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async fetchCoopEarnings(
    @Query('currency') currency: string,
    @Req() req,
    @Headers() headers,
  ) {
    const response = await this.transactionsService.fetchCoopEarnings(
      currency.toUpperCase(),
      req.user.sub,
      headers['x-platform'],
    );
    if (response instanceof ErrorResponseDto) {
      throw new HttpException(response, response.statusCode);
    }
    return response;
  }

  @Get('earnings/mtd')
  @ApiOperation({
    summary: 'Get cooperative daily month-to-date earnings by currency',
    description: 'Retrieves cooperative earnings filtered by currency',
  })
  @ApiQuery({
    name: 'currency',
    description: 'Currency to filter earnings by',
  })
  @ApiResponse({
    status: 200,
    description: 'Cooperative earnings retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async fetchCoopEarningsDailyMTD(
    @Query('currency') currency: string,
    @Req() req,
    @Headers() headers,
  ) {
    const response = await this.transactionsService.fetchCoopEarningsDailyMTD(
      currency.toUpperCase(),
      req.user.sub,
      headers['x-platform'],
    );
    if (response instanceof ErrorResponseDto) {
      throw new HttpException(response, response.statusCode);
    }
    return response;
  }

  @Get('coop-disbursements')
  @ApiOperation({
    summary: 'Get cooperative disbursements',
    description: 'Retrieves cooperative disbursements for all cooperatives',
  })
  @ApiResponse({
    status: 200,
    description: 'Cooperative disbursements retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async fetchCoopDisbursements(@Req() req, @Headers() headers) {
    const response = await this.transactionsService.fetchCoopDisbursements(
      req.user.sub,
      headers['x-platform'],
    );
    if (response instanceof ErrorResponseDto) {
      throw new HttpException(response, response.statusCode);
    }
    return response;
  }

  @Get('coop-disbursement-totals')
  @ApiOperation({
    summary: 'Get total disbursements per cooperative and currency',
    description: 'Retrieves cooperative disbursements per cooperatives',
  })
  @ApiResponse({
    status: 200,
    description: 'Cooperative disbursements retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async fetchCoopDisbursementTotals(@Req() req, @Headers() headers) {
    const response = await this.transactionsService.fetchCoopDisbursementTotals(
      req.user.sub,
      headers['x-platform'],
    );
    if (response instanceof ErrorResponseDto) {
      throw new HttpException(response, response.statusCode);
    }
    return response;
  }

  @Get('coop-analytics')
  @ApiOperation({
    summary: 'Get cooperative analytics',
    description: 'Retrieves cooperative analytics for all cooperatives',
  })
  @ApiResponse({
    status: 200,
    description: 'Cooperative analytics retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async fetchCoopAnalytics(@Req() req, @Headers() headers) {
    const response = await this.transactionsService.fetchCoopAnalytics(
      req.user.sub,
      headers['x-platform'],
    );
    if (response instanceof ErrorResponseDto) {
      throw new HttpException(response, response.statusCode);
    }
    return response;
  }
  @Get('filter')
  async streamTransactions(
    @Query('wallet_id') wallet_id: string,
    @Query('transaction_type') transaction_type: string,
  ) {
    const response = await this.transactionsService.streamTransactions(
      wallet_id,
      transaction_type,
    );
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

  @ApiOperation({
    summary: 'Get cooperative loan disbursements ',
    description:
      'Retrieves cooperative loan disbursements for all cooperatives',
  })
  @ApiResponse({
    status: 200,
    description: 'Cooperative loan disbursements retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiQuery({
    name: 'cooperative_id',
    description: 'Cooperative ID to filter disbursements by',
  })
  @Get('disbursements/filter')
  async fetchCoopLoanDisbursements(
    @Query('cooperative_id') cooperative_id: string,
  ) {
    const response =
      await this.transactionsService.fetchCoopLoanDisbursements(cooperative_id);
    if (response instanceof ErrorResponseDto) {
      throw new HttpException(response, response.statusCode);
    }
    return response;
  }

  @ApiOperation({
    summary: 'Fetch cooperative transactions',
    description: 'Retrieves cooperative transactions for all cooperatives',
  })
  @ApiResponse({
    status: 200,
    description: 'Cooperative transactions retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @Get('coop-transactions/filter')
  async fetchCoopTransactions(@Query('cooperative_id') cooperative_id: string) {
    const response =
      await this.transactionsService.fetchCoopTransactions(cooperative_id);
    if (response instanceof ErrorResponseDto) {
      throw new HttpException(response, response.statusCode);
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
