/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Post, HttpException } from '@nestjs/common';
import {
  CreateWalletRequest,
  LoginRequest,
  SetPasswordRequest,
} from '../requests/registration_and_auth.requests';
import {
  BalanceEnquiryRequest,
  BankToOtherWalletTransferRequest,
  BankToWalletTransferRequest,
  CashOutRequest,
  PayMerchantRequest,
  WalletToOtherBankTransferRequest,
  WalletToOwnBankTransferRequest,
  WalletToWalletTransferRequest,
} from '../requests/transactions.requests';
import { SmileCashWalletService } from '../services/smilecash-wallet.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { SuccessResponseDto } from '../../dto/success-response.dto';
import { GeneralErrorResponseDto } from 'src/common/dto/general-error-response.dto';
import { MunicipalityBillRequest } from '../requests/municipality-bill.request';
// import { GeneralErrorResponseDto } from '../../common/dto/general-error-response.dto';

@ApiTags('SmileCash Wallet')
// @ApiExcludeController()
@Controller('smilecash-wallet')
export class SmileCashWalletController {
  constructor(private readonly scWallet: SmileCashWalletService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new wallet' })
  @ApiBody({ type: CreateWalletRequest })
  @ApiResponse({
    status: 201,
    description: 'Wallet created successfully',
    // type: SuccessResponseDto,
    example: new SuccessResponseDto(201, 'Wallet created successfully', {
      firstName: 'Tess',
      lastName: 'Tesseract',
      mobile: '263711809713',
      dateOfBirth: '2025-12-13',
      idNumber: '23111223Q43',
      gender: 'FEMALE',
      source: 'Smile SACCO',
    }),
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    // type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Mobile number already taken',
    // type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    // type: GeneralErrorResponseDto,
  })
  async createWallet(@Body() createWalletRequest: CreateWalletRequest) {
    const response = await this.scWallet.createWallet(createWalletRequest);
    if (response.statusCode !== 201) {
      throw new HttpException(response.message!, response.statusCode);
    }
    return response;
  }

  @ApiExcludeEndpoint()
  @Post('login')
  @ApiOperation({ summary: 'Login to wallet' })
  @ApiBody({ type: LoginRequest })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: GeneralErrorResponseDto,
  })
  async login(@Body() loginRequest: LoginRequest) {
    const response = await this.scWallet.login(loginRequest);
    if (response.statusCode !== 200) {
      throw new HttpException(response.message!, response.statusCode);
    }
    return response;
  }

  @ApiExcludeEndpoint()
  @Post('set-password')
  @ApiOperation({ summary: 'Set wallet password' })
  @ApiBody({ type: SetPasswordRequest })
  @ApiResponse({
    status: 200,
    description: 'Password set successfully',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: GeneralErrorResponseDto,
  })
  async setPassword(@Body() setPasswordRequst: SetPasswordRequest) {
    const response = await this.scWallet.setPassword(setPasswordRequst);
    if (response.statusCode !== 200) {
      throw new HttpException(response.message!, response.statusCode);
    }
    return response;
  }

  @Post('balance-enquiry')
  @ApiOperation({ summary: 'Check wallet balance' })
  @ApiBody({ type: BalanceEnquiryRequest })
  @ApiResponse({
    status: 200,
    description: 'Balance enquiry successful',
    // type: SuccessResponseDto,
    example: new SuccessResponseDto(200, 'Balance enquiry successful', {
      responseCode: '000',
      responseDescription: 'Approved or completed successfully',
      data: {
        id: '3b29efda-2fd7-4faf-a98a-66ad4168fa90',
        reference: 'Wa12d75cc8e6f40d',
        currency: 'USD',
        product: 'default',
        amount: 0,
        transactorId: 'db790935-536e-43a2-b7b5-cb72e5266a78',
        transactorName: 'Simon Moyo',
        source: '263718439965',
        destination: '263718439965',
        transactionDate: '2025-09-15T12:24:44.896425747',
        channel: 'USSD',
        description: 'BALANCE_ENQUIRY',
        transactionStatus: 'COMPLETE',
        typeOfTransaction: 'BALANCE_ENQUIRY',
        authResponse: null,
        billerResponse: {
          balance: 528.57,
        },
        additionalData: null,
        transactionStateDescription:
          'Balance Enquiry (Successful)\nAccount: 263718439965\nDate: 15/09/2025 12:24\nBalance: $528.57 USD\n',
        parsedDetails: {
          status: 'Balance Enquiry (Successful)',
          details: {
            Account: '263718439965',
            Date: '15/09/2025 12:24',
            Balance: 528.57,
            BalanceRaw: '$528.57 USD',
          },
        },
      },
    }),
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to authorize balance enquiry',
    // type: GeneralErrorResponseDto,
    example: new GeneralErrorResponseDto(
      400,
      'Failed to authorize balance enquiry',
    ),
  })
  @ApiResponse({
    status: 405,
    description: 'Insufficient funds',
    // type: GeneralErrorResponseDto,
    example: new GeneralErrorResponseDto(405, 'Insufficient funds'),
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    example: new GeneralErrorResponseDto(500, 'Internal server error'),
    // type: GeneralErrorResponseDto,
  })
  async balanceEnquiry(@Body() balanceEnquiryRequest: BalanceEnquiryRequest) {
    const response = await this.scWallet.balanceEnquiry(balanceEnquiryRequest);
    if (response.statusCode !== 200) {
      throw new HttpException(response.message!, response.statusCode);
    }
    return response;
  }

  @Post('transfer/bank-to-wallet')
  @ApiOperation({ summary: 'Transfer from bank to wallet' })
  @ApiBody({ type: BankToWalletTransferRequest })
  @ApiResponse({
    status: 200,
    description: 'Bank to wallet transfer successful',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to authorize transfer',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 405,
    description: 'Insufficient funds',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: GeneralErrorResponseDto,
  })
  async bankToWallet(@Body() bankToWalletRequest: BankToWalletTransferRequest) {
    const response = await this.scWallet.bankToWallet(bankToWalletRequest);
    if (response.statusCode !== 200) {
      throw new HttpException(response.message!, response.statusCode);
    }
    return response;
  }

  @Post('transfer/wallet-to-wallet')
  @ApiOperation({ summary: 'Transfer from wallet to wallet' })
  @ApiBody({ type: WalletToWalletTransferRequest })
  @ApiResponse({
    status: 200,
    description: 'Wallet to wallet transfer successful',
    // type: SuccessResponseDto,
    example: {
      responseCode: '000',
      responseDescription: 'Approved or completed successfully',
      data: {
        id: 'bbf1cdd9-bb11-4eea-bc9b-5eebb5b1b70f',
        reference: 'W057b0338840c422',
        currency: 'USD',
        product: 'default',
        amount: 5,
        transactorId: 'db790935-536e-43a2-b7b5-cb72e5266a78',
        transactorName: 'Simon Moyo',
        source: '263718439965',
        destination: '263785076046',
        transactionDate: '2025-09-15T12:35:37.647911',
        channel: 'USSD',
        description: 'P2P Transfer',
        transactionStatus: 'COMPLETE',
        typeOfTransaction: 'P2P_TRANSFER',
        authResponse: null,
        billerResponse: null,
        additionalData: null,
        transactionStateDescription:
          'P2P Transfer (Successful)\nAmount: $5.00 USD\nDestination: 263785076046\nDate: 15/09/2025 12:35\nBalance: $523.460 USD\n',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to authorize transfer',
    // type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 405,
    description: 'Insufficient funds',
    // type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 406,
    description: 'Failed to process transfer',
    // type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    // type: GeneralErrorResponseDto,
  })
  async walletToWallet(
    @Body() walletToWalletTransferRequest: WalletToWalletTransferRequest,
  ) {
    const response = await this.scWallet.walletToWallet(
      walletToWalletTransferRequest,
    );
    if (response.statusCode !== 200) {
      throw new HttpException(response.message!, response.statusCode);
    }
    return response;
  }

  @Post('transfer/wallet-to-own-bank')
  @ApiOperation({ summary: 'Transfer from wallet to own bank' })
  @ApiBody({ type: WalletToOwnBankTransferRequest })
  @ApiResponse({
    status: 200,
    description: 'Wallet to own bank transfer successful',
    // type: SuccessResponseDto,
    example: new SuccessResponseDto(
      200,
      'Wallet to own bank transfer successful',
      {
        responseCode: '000',
        responseDescription: 'Approved or completed successfully',
        data: {
          id: '4e175fdd-7c3b-4dfe-9073-77661305ad70',
          reference: 'W9af97ddc7d67462',
          currency: 'USD',
          product: 'default',
          amount: 2.5,
          transactorId: 'db790935-536e-43a2-b7b5-cb72e5266a78',
          transactorName: 'Simon Moyo',
          source: '263718439965',
          destination: '411300074182405',
          transactionDate: '2025-09-15T13:03:07.594615648',
          channel: 'USSD',
          description: 'Wallet to bank transfer',
          transactionStatus: 'PENDING',
          typeOfTransaction: 'WALLET_TO_BANK',
          authResponse: null,
          billerResponse: null,
          additionalData: null,
          transactionStateDescription:
            '    Wallet to bank (Successful)\n    Amount: $2.50 USD\n    Destination: 411300074182405\n    Date: 15/09/2025 13:03\n',
        },
      },
    ),
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to authorize transfer',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 405,
    description: 'Insufficient funds',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: GeneralErrorResponseDto,
  })
  async walletToOwnBank(
    @Body() walletToOwnBankTransferRequest: WalletToOwnBankTransferRequest,
  ) {
    const response = await this.scWallet.walletToOwnBank(
      walletToOwnBankTransferRequest,
    );
    if (response.statusCode !== 200) {
      throw new HttpException(response.message!, response.statusCode);
    }
    return response;
  }

  @Post('transfer/wallet-to-other-bank')
  @ApiOperation({ summary: 'Transfer from wallet to other bank' })
  @ApiBody({ type: WalletToOtherBankTransferRequest })
  @ApiResponse({
    status: 200,
    description: 'Wallet to other bank transfer successful',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to authorize transfer',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 405,
    description: 'Insufficient funds',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: GeneralErrorResponseDto,
  })
  async walletToOtherBank(
    @Body() walletToOtherBankTransferRequest: WalletToOtherBankTransferRequest,
  ) {
    const response = await this.scWallet.walletToOtherBank(
      walletToOtherBankTransferRequest,
    );
    if (response.statusCode !== 200) {
      throw new HttpException(response.message!, response.statusCode);
    }
    return response;
  }

  @Post('transfer/pay-merchant')
  @ApiOperation({ summary: 'Pay merchant' })
  @ApiBody({ type: PayMerchantRequest })
  @ApiResponse({
    status: 200,
    description: 'Merchant payment successful',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to authorize payment',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 405,
    description: 'Insufficient funds',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: GeneralErrorResponseDto,
  })
  async payMerchant(@Body() payMerchantRequest: PayMerchantRequest) {
    const response = await this.scWallet.payMerchant(payMerchantRequest);
    if (response.statusCode !== 200) {
      throw new HttpException(response.message!, response.statusCode);
    }
    return response;
  }

  @Post('transfer/cash-out')
  @ApiOperation({ summary: 'Cash out from wallet' })
  @ApiBody({ type: CashOutRequest })
  @ApiResponse({
    status: 200,
    description: 'Cash out successful',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to authorize cash out',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 405,
    description: 'Insufficient funds',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: GeneralErrorResponseDto,
  })
  async cashOut(@Body() cashOutRequest: CashOutRequest) {
    const response = await this.scWallet.cashOut(cashOutRequest);
    if (response.statusCode !== 200) {
      throw new HttpException(response.message!, response.statusCode);
    }
    return response;
  }

  @Post('transfer/bank-to-other-wallet')
  @ApiOperation({ summary: 'Transfer from bank to other wallet' })
  @ApiBody({ type: BankToOtherWalletTransferRequest })
  @ApiResponse({
    status: 200,
    description: 'Bank to other wallet transfer successful',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to authorize transfer',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 405,
    description: 'Insufficient funds',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: GeneralErrorResponseDto,
  })
  async bankToOtherWallet(
    @Body() bankToOtherWalletTransferRequest: BankToOtherWalletTransferRequest,
  ) {
    const response = await this.scWallet.bankToOtherWallet(
      bankToOtherWalletTransferRequest,
    );
    if (response.statusCode !== 200) {
      throw new HttpException(response.message!, response.statusCode);
    }
    return response;
  }

  @Post('pay/municipality')
  @ApiOperation({ summary: 'Pay municipality' })
  @ApiBody({ type: MunicipalityBillRequest })
  @ApiResponse({
    status: 200,
    description: 'Payment successful',
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to authorize transfer',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 405,
    description: 'Insufficient funds',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: GeneralErrorResponseDto,
  })
  async payMunicipalityBill(@Body() mbrDto: MunicipalityBillRequest) {
    const response = await this.scWallet.payMunicipalityBill(mbrDto);
    if (response instanceof GeneralErrorResponseDto) {
      throw new HttpException(response.message!, response.statusCode);
    }
    return response;
  }
}
