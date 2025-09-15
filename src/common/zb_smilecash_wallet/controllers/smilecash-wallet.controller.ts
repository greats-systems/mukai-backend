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
  ApiExcludeController,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { SuccessResponseDto } from '../../dto/success-response.dto';
import { GeneralErrorResponseDto } from 'src/common/dto/general-error-response.dto';
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
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Mobile number already taken',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: GeneralErrorResponseDto,
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
    type: SuccessResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Failed to authorize balance enquiry',
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
    status: 406,
    description: 'Failed to process transfer',
    type: GeneralErrorResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: GeneralErrorResponseDto,
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
}
