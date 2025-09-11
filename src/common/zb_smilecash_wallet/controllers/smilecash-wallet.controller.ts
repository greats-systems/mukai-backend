/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Post } from '@nestjs/common';
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
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('smilecash-wallet')
export class SmileCashWalletController {
  constructor(private readonly scWallet: SmileCashWalletService) {}

  @Post('create')
  async createWallet(@Body() createWalletRequest: CreateWalletRequest) {
    return await this.scWallet.createWallet(createWalletRequest);
  }

  @Post('login')
  async login(@Body() loginRequest: LoginRequest) {
    return await this.scWallet.login(loginRequest);
  }

  @Post('set-password')
  async setPassword(@Body() setPasswordRequst: SetPasswordRequest) {
    return await this.scWallet.setPassword(setPasswordRequst);
  }

  @Post('balance-enquiry')
  async balanceEnquiry(@Body() balanceEnquiryRequest: BalanceEnquiryRequest) {
    return await this.scWallet.balanceEnquiry(balanceEnquiryRequest);
  }

  @Post('transfer/bank-to-wallet')
  async bankToWallet(@Body() bankToWalletRequest: BankToWalletTransferRequest) {
    return await this.scWallet.bankToWallet(bankToWalletRequest);
  }

  @Post('transfer/wallet-to-wallet')
  async walletToWallet(
    @Body() walletToWalletTransferRequest: WalletToWalletTransferRequest,
  ) {
    return await this.scWallet.walletToWallet(walletToWalletTransferRequest);
  }

  @Post('transfer/wallet-to-own-bank')
  async walletToOwnBank(
    @Body() walletToOwnBankTransferRequest: WalletToOwnBankTransferRequest,
  ) {
    return await this.scWallet.walletToOwnBank(walletToOwnBankTransferRequest);
  }

  @Post('transfer/wallet-to-other-bank')
  async walletToOtherBank(
    @Body() walletToOtherBankTransferRequest: WalletToOtherBankTransferRequest,
  ) {
    return await this.scWallet.walletToOtherBank(
      walletToOtherBankTransferRequest,
    );
  }

  @Post('transfer/pay-merchant')
  async payMerchant(@Body() payMerchantRequest: PayMerchantRequest) {
    return await this.scWallet.payMerchant(payMerchantRequest);
  }

  @Post('transfer/cash-out')
  async cashOut(@Body() cashOutRequest: CashOutRequest) {
    return await this.scWallet.cashOut(cashOutRequest);
  }

  @Post('transfer/bank-to-other-wallet')
  async bankToOtherWallet(
    @Body() bankToOtherWalletTransferRequest: BankToOtherWalletTransferRequest,
  ) {
    return await this.scWallet.bankToOtherWallet(
      bankToOtherWalletTransferRequest,
    );
  }
}
