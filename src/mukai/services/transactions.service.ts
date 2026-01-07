/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateTransactionDto } from '../dto/create/create-transaction.dto';
import { Transaction } from '../entities/transaction.entity';

import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { SmileCashWalletService } from 'src/common/zb_smilecash_wallet/services/smilecash-wallet.service';
import {
  BalanceEnquiryRequest,
  WalletToWalletTransferRequest,
} from 'src/common/zb_smilecash_wallet/requests/transactions.requests';
import { GeneralErrorResponseDto } from 'src/common/dto/general-error-response.dto';
import { WalletsService } from './wallets.service';
import { Int32 } from 'typeorm';
import { MunicipalityBillRequest } from 'src/common/zb_smilecash_wallet/requests/municipality-bill.request';
import { CreateSystemLogDto } from '../dto/create/create-system-logs.dto';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class TransactionsService {
  private readonly logger = initLogger(TransactionsService);

  constructor(
    private readonly postgresrest: PostgresRest,
    private readonly scwService?: SmileCashWalletService,
    private readonly walletsService?: WalletsService,
    // private readonly smileWalletService: SmileWalletService,
  ) {}

  async hasPaidSubscription(
    sending_wallet_uuid: string,
    check_year: Int32,
    check_month: Int32,
  ): Promise<boolean | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.rpc(
        'has_paid_subscription',
        { check_month, check_year, sending_wallet_uuid },
      );
      if (error) {
        this.logger.log(error);
        return new ErrorResponseDto(400, error.details);
      }
      this.logger.log(`hasPaidSubscription: ${data}`);
      if (data) {
        return true;
      }
      return false;
    } catch (error) {
      this.logger.log(error);
      return new ErrorResponseDto(500, error);
    }
  }

  async createTransaction(
    senderTransactionDto: CreateTransactionDto,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      // const scwService = new SmileCashWalletService(this.postgresrest);
      /*When a transaction is initiated, 4 steps should take place:
       1. the initiator's transaction is recorded in the transactions table
       2. the initiator's wallet is debited
       3. the receiver's wallet is credited
       4 the receiver's credit is recorded in the transactions table

       When SmileCash money is transferred, the new balances of the sender and receiver should reflect accordingly
       */
      // const walletsService = new WalletsService(
      //   this.postgresrest,
      //   this.scwService,
      //   // this.smileWalletService,
      // );
      const { data, error } = await this.postgresrest
        .from('transactions')
        .insert(senderTransactionDto)
        .select()
        .single();
      if (error) {
        this.logger.log(error);
        return new ErrorResponseDto(400, error.details);
      }

      this.logger.debug(`Transaction created: ${JSON.stringify(data)}`);
      const scSenderParams = {
        transactorMobile: senderTransactionDto.sending_phone,
        currency: senderTransactionDto.currency?.toUpperCase(),
        channel: 'USSD',
        transactionId: '',
      } as BalanceEnquiryRequest;

      // Update sender's SmileCash balance
      this.logger.debug(`Sender currency: ${senderTransactionDto.currency}`);
      this.logger.warn('Updating sender SmileCash balance');
      const scSenderResponse =
        await this.scwService!.balanceEnquiry(scSenderParams);
      if (scSenderResponse instanceof GeneralErrorResponseDto) {
        this.logger.error(
          `Error in sender balance enquiry: ${JSON.stringify(scSenderResponse.errorObject)}`,
        );
        return scSenderResponse;
      }
      const senderResponse = await this.walletsService!.updateSmileCashBalance(
        senderTransactionDto.sending_wallet,
        scSenderResponse.data.data.billerResponse.balance,
        senderTransactionDto.currency!.toUpperCase(),
      );

      this.logger.debug(
        `Sender balance updated: ${JSON.stringify(senderResponse)}`,
      );

      // Update receiver's SmileCash balance
      const scReceiverParams = {
        transactorMobile: senderTransactionDto.receiving_phone,
        currency: senderTransactionDto.currency?.toUpperCase(),
        channel: 'USSD',
        transactionId: '',
      } as BalanceEnquiryRequest;
      this.logger.warn(`Updating receiver SmileCash balance`);
      const scReceiverResponse =
        await this.scwService!.balanceEnquiry(scReceiverParams);
      if (scReceiverResponse instanceof GeneralErrorResponseDto) {
        this.logger.error(
          `Error in receiver balance enquiry: ${JSON.stringify(scReceiverResponse.errorObject)}`,
        );
        return scReceiverResponse;
      }
      const receiverResponse =
        await this.walletsService!.updateSmileCashBalance(
          senderTransactionDto.receiving_wallet,
          scReceiverResponse.data.data.billerResponse.balance,
          senderTransactionDto.currency!.toUpperCase(),
        );

      this.logger.debug(
        `Receiver balance updated: ${JSON.stringify(receiverResponse)}`,
      );
      return {
        statusCode: 201,
        message: 'Transaction created successfully',
        data: {
          message: senderTransactionDto,
          // transaction_id: data.id,
          // date: data.created_date,
          // new_balance: debitResponse['balance'] ?? 0.0,
        },
        // debitResponse,
        // creditResponse
      };
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async payMunicipalityBill(
    mbRequest: MunicipalityBillRequest,
  ): Promise<SuccessResponseDto | GeneralErrorResponseDto> {
    try {
      const scwService = new SmileCashWalletService(this.postgresrest);
      // 1. Transfer customer's US$ funds to agent account (wallet-to-wallet)
      const pmbResponse = await scwService.payMunicipalityBill(mbRequest);
      if (pmbResponse instanceof GeneralErrorResponseDto) {
        return pmbResponse;
      }

      // 3. Return a success message
      this.logger.log('Payment successful!');

      const senderTransactionDto = new CreateTransactionDto();
      senderTransactionDto.narrative = 'bill payment';
      senderTransactionDto.amount = mbRequest.w2obTransferRequest.amount;
      senderTransactionDto.currency = 'ZWG';
      senderTransactionDto.sending_phone = '263780032799';
      senderTransactionDto.receiving_phone =
        mbRequest.w2obTransferRequest.bankAccount;
      senderTransactionDto.transfer_mode = 'WALLETPLUS';

      const { data, error } = await this.postgresrest
        .from('transactions')
        .insert(senderTransactionDto)
        .select()
        .single();

      if (error) {
        return new GeneralErrorResponseDto(
          400,
          'Failed to record transaction',
          error,
        );
      }

      return new SuccessResponseDto(201, 'Payment successful!', data);
    } catch (e) {
      this.logger.error(`payMunicipalityBill error: ${e}`);
      return new GeneralErrorResponseDto(500, 'payMunicipalityBill error', e);
    }
  }

  async createP2PTransaction(
    senderTransactionDto: CreateTransactionDto,
    logged_in_user_id: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    let transactionRecord: any = null;
    const slDto = new CreateSystemLogDto();
    slDto.profile_id = logged_in_user_id;
    slDto.action = `payment: ${senderTransactionDto.transaction_type}`;
    slDto.request = senderTransactionDto;

    try {
      const scwService = new SmileCashWalletService(this.postgresrest);
      const walletsService = new WalletsService(this.postgresrest, undefined);

      // Step 1: Initiate wallet-to-wallet transfer
      const request = {
        receiverMobile: senderTransactionDto.receiving_phone,
        senderPhone: senderTransactionDto.sending_phone,
        amount: senderTransactionDto.amount,
        currency: senderTransactionDto.currency,
        channel: senderTransactionDto.transfer_mode,
        narration: senderTransactionDto.transaction_type,
      };

      this.logger.warn('Initiating wallet to wallet transfer');
      this.logger.debug('Starting walletToWallet transfer', request);

      const w2wResponse = await scwService.walletToWallet(
        request as WalletToWalletTransferRequest,
      );

      // Handle wallet transfer failure
      if (w2wResponse instanceof GeneralErrorResponseDto) {
        this.logger.error(
          `Error in wallet to wallet transfer: ${JSON.stringify(w2wResponse.errorObject)}`,
        );
        slDto.response = w2wResponse;
        await this.createSystemLog(slDto);
        return w2wResponse;
      }

      this.logger.debug(
        `Wallet to wallet transfer response: ${JSON.stringify(w2wResponse)}`,
      );

      // Step 2: Record the transaction in database
      const { data, error } = await this.postgresrest
        .from('transactions')
        .insert(senderTransactionDto)
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to insert transaction record', error);
        slDto.response = { statusCode: 400, message: error.details };
        await this.createSystemLog(slDto);
        return new ErrorResponseDto(400, error.details);
      }

      transactionRecord = data;
      slDto.response = {
        statusCode: 201,
        message: 'Transaction created successfully',
      };

      // Step 3: Create system log for the transaction
      const logResult = await this.createSystemLog(slDto);
      if (logResult instanceof GeneralErrorResponseDto) {
        this.logger.warn(
          'Failed to create system log, but transaction succeeded',
        );
      }

      this.logger.debug(`Transaction created: ${JSON.stringify(data)}`);

      // Step 4: Update sender and receiver balances (non-blocking operations)
      // These operations should not fail the main transaction
      await this.updateBalancesAfterTransfer(
        senderTransactionDto,
        scwService,
        walletsService,
      );

      // Return success response
      return {
        statusCode: 201,
        message: 'Transaction created successfully',
        data: {
          transaction: senderTransactionDto,
          transaction_id: transactionRecord.id,
          date: transactionRecord.created_date,
          wallet_transfer: {
            status: 'COMPLETE',
            reference:
              w2wResponse.data?.reference || w2wResponse.data?.data?.reference,
          },
        },
      };
    } catch (error) {
      this.logger.error('Unexpected error in createP2PTransaction', error);

      // Even on unexpected error, try to log it
      slDto.response = {
        statusCode: 500,
        message: 'Unexpected error occurred',
      };
      try {
        await this.createSystemLog(slDto);
      } catch (logError) {
        this.logger.error('Failed to log error', logError);
      }

      return new ErrorResponseDto(
        500,
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  /**
   * Helper method to update balances after successful transfer
   * This runs asynchronously and doesn't block the main transaction response
   */
  private async updateBalancesAfterTransfer(
    senderTransactionDto: CreateTransactionDto,
    scwService: SmileCashWalletService,
    walletsService: WalletsService,
  ): Promise<void> {
    try {
      // Update sender balance
      await this.updateWalletBalance(
        senderTransactionDto.sending_phone,
        senderTransactionDto.sending_wallet,
        senderTransactionDto.currency?.toUpperCase() || 'USD',
        scwService,
        walletsService,
        'sender',
      );

      // Update receiver balance
      await this.updateWalletBalance(
        senderTransactionDto.receiving_phone,
        senderTransactionDto.receiving_wallet,
        senderTransactionDto.currency?.toUpperCase() || 'USD',
        scwService,
        walletsService,
        'receiver',
      );
    } catch (error) {
      this.logger.error('Error in balance updates (non-critical)', error);
      // Don't throw - this is a non-critical operation
    }
  }

  /**
   * Helper method to update individual wallet balance
   */
  private async updateWalletBalance(
    phone: string,
    walletId: string,
    currency: string,
    scwService: SmileCashWalletService,
    walletsService: WalletsService,
    role: 'sender' | 'receiver',
  ): Promise<void> {
    try {
      this.logger.warn(`Updating ${role} SmileCash balance for ${phone}`);

      const balanceParams = {
        transactorMobile: phone,
        currency: currency,
        channel: 'USSD',
        transactionId: '',
      } as BalanceEnquiryRequest;

      const balanceResponse = await scwService.balanceEnquiry(balanceParams);

      if (balanceResponse instanceof GeneralErrorResponseDto) {
        this.logger.warn(
          `Failed to get ${role} balance enquiry, but transaction succeeded. Error: ${JSON.stringify(balanceResponse.errorObject)}`,
        );
        return;
      }

      const balance = this.extractBalanceFromResponse(balanceResponse);

      if (balance === null) {
        this.logger.warn(`Could not extract ${role} balance from response`);
        return;
      }

      this.logger.debug(`New ${role} balance: ${balance} ${currency}`);

      const updateResult = await walletsService.updateSmileCashBalance(
        walletId,
        balance,
        currency,
      );

      if (
        updateResult instanceof ErrorResponseDto ||
        updateResult instanceof GeneralErrorResponseDto
      ) {
        this.logger.warn(
          `Failed to update ${role} wallet in database, but SmileCash balance is ${balance}. Error: ${JSON.stringify(updateResult)}`,
        );
      } else {
        this.logger.debug(`${role} wallet updated successfully`);
      }
    } catch (error) {
      this.logger.error(`Error updating ${role} wallet balance`, error);
      // Don't throw - continue execution
    }
  }

  /**
   * Helper method to extract balance from various response formats
   */
  private extractBalanceFromResponse(response: any): number | null {
    try {
      // Check multiple possible locations for balance
      const possiblePaths = [
        response.data?.data?.billerResponse?.balance,
        response.data?.data?.additionalData?.balance,
        response.data?.balance,
        response.balance,
      ];

      for (const balance of possiblePaths) {
        if (balance !== undefined && balance !== null) {
          const parsed = parseFloat(balance);
          if (!isNaN(parsed)) return parsed;
        }
      }

      // Try to extract from description if available
      const description =
        response.data?.data?.description || response.description;
      if (description && typeof description === 'string') {
        // Try patterns like "Balance: $26.920 USD" or "Balance: 26.92"
        const patterns = [
          /Balance:\s*\$?([\d.,]+)\s*(?:USD|ZWL)?/i,
          /Balance\s*:\s*([\d.,]+)/i,
        ];

        for (const pattern of patterns) {
          const match = description.match(pattern);
          if (match && match[1]) {
            const balanceStr = match[1].replace(/,/g, '');
            const parsed = parseFloat(balanceStr);
            if (!isNaN(parsed)) return parsed;
          }
        }
      }

      this.logger.warn('Could not find balance in response', { response });
      return null;
    } catch (error) {
      this.logger.error('Error extracting balance from response', error);
      return null;
    }
  }

  /**
   * Helper method to create system logs
   */
  private async createSystemLog(
    slDto: CreateSystemLogDto,
  ): Promise<{ data: any } | GeneralErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('system_logs')
        .insert(slDto)
        .select()
        .single();

      if (error) {
        this.logger.error('Failed to insert system log', error);
        return new GeneralErrorResponseDto(400, 'Failed to insert log', error);
      }

      this.logger.warn('System log created', data);
      return { data };
    } catch (error) {
      this.logger.error('Unexpected error creating system log', error);
      return new GeneralErrorResponseDto(
        500,
        'Unexpected error creating log',
        error,
      );
    }
  }

  async createSmilePayTransaction(
    senderTransactionDto: CreateTransactionDto,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      // const scwService = new SmileCashWalletService(this.postgresrest);
      /*When a transaction is initiated, 4 steps should take place:
       1. the initiator's transaction is recorded in the transactions table
       2. the initiator's wallet is debited
       3. the receiver's wallet is credited
       4 the receiver's credit is recorded in the transactions table

       When SmileCash money is transferred, the new balances of the sender and receiver should reflect accordingly
       */
      // const walletsService = new WalletsService(
      //   this.postgresrest,
      //   this.scwService,
      //   // this.smileWalletService,
      // );

      const { data, error } = await this.postgresrest
        .from('transactions')
        .insert(senderTransactionDto)
        .select()
        .single();
      if (error) {
        this.logger.log(error);
        return new ErrorResponseDto(400, error.details);
      }

      this.logger.debug(`Transaction created: ${JSON.stringify(data)}`);

      /**
       * "transactorMobile":"263777757603",
    "currency":"USD", // ZWG | USD
    "channel":"USSD", //USSD | APP | WEB
    "transactionId":""
       */

      const scSenderParams = {
        transactorMobile: senderTransactionDto.sending_phone,
        currency: senderTransactionDto.currency?.toUpperCase(),
        channel: 'USSD',
        transactionId: '',
      } as BalanceEnquiryRequest;

      // Update sender's SmileCash balance
      this.logger.warn('Updating sender SmileCash balance');
      const scSenderResponse =
        await this.scwService!.balanceEnquiry(scSenderParams);
      if (scSenderResponse instanceof GeneralErrorResponseDto) {
        this.logger.error(
          `Error in sender balance enquiry: ${JSON.stringify(scSenderResponse.errorObject)}`,
        );
        return scSenderResponse;
      }
      const senderBalance =
        scSenderResponse.data?.data?.additionalData?.balance ||
        scSenderResponse.data?.balance;
      this.logger.warn('sender balance', senderBalance);
      const senderResponse = await this.walletsService!.updateSmileCashBalance(
        senderTransactionDto.sending_wallet,
        senderBalance,
        senderTransactionDto.currency!.toUpperCase(),
      );

      this.logger.debug(
        `Sender balance updated: ${JSON.stringify(senderResponse)}`,
      );

      // Update receiver's SmileCash balance
      const scReceiverParams = {
        transactorMobile: senderTransactionDto.receiving_phone,
        currency: senderTransactionDto.currency?.toUpperCase(),
        channel: 'USSD',
        transactionId: '',
      } as BalanceEnquiryRequest;
      this.logger.warn(`Updating receiver SmileCash balance`);
      const scReceiverResponse =
        await this.scwService!.balanceEnquiry(scReceiverParams);
      if (scReceiverResponse instanceof GeneralErrorResponseDto) {
        this.logger.error(
          `Error in receiver balance enquiry: ${JSON.stringify(scReceiverResponse.errorObject)}`,
        );
        return scReceiverResponse;
      }
      const receiverBalance =
        scReceiverResponse.data?.data?.additionalData?.balance ||
        scReceiverResponse.data?.balance;
      this.logger.warn('receiver balance', receiverBalance);
      const receiverResponse =
        await this.walletsService!.updateSmileCashBalance(
          senderTransactionDto.receiving_wallet,
          receiverBalance,
          senderTransactionDto.currency!.toUpperCase(),
        );

      this.logger.debug(
        `Receiver balance updated: ${JSON.stringify(receiverResponse)}`,
      );

      /*
      this.logger.warn('Updating sender wallet');
      
      const debitResponse = await walletsService.updateSenderBalance(
        senderTransactionDto.sending_wallet,
        senderTransactionDto.amount,
      );
      this.logger.log(debitResponse);
      this.logger.warn('Updating receiver wallet');
      const creditResponse = await walletsService.updateReceiverBalance(
        senderTransactionDto.receiving_wallet,
        senderTransactionDto.amount,
      );
      this.logger.log(creditResponse);

      receiverTransactionDto.sending_wallet =
        senderTransactionDto.sending_wallet;
      receiverTransactionDto.receiving_wallet =
        senderTransactionDto.receiving_wallet;
      receiverTransactionDto.amount = senderTransactionDto.amount;
      receiverTransactionDto.category = senderTransactionDto.category;
      receiverTransactionDto.transfer_mode = senderTransactionDto.transfer_mode;
      receiverTransactionDto.transaction_type =
        senderTransactionDto.transaction_type;
      receiverTransactionDto.currency = senderTransactionDto.currency;
      receiverTransactionDto.narrative = 'credit';

      const { data: receiver, error: receiverError } = await this.postgresrest
        .from('transactions')
        .insert(receiverTransactionDto)
        .select()
        .single();
      if (receiverError) {
        this.logger.log(receiverError);
        return new ErrorResponseDto(400, receiverError.message);
      }
      this.logger.log(receiver);

      if (senderTransactionDto.receiving_phone) {
        // GET SENDING PROFILE
        const { data: sendingProfile, error: sendingProfileError } =
          await this.postgresrest
            .from('profiles')
            .select()
            .eq('id', senderTransactionDto.account_id)
            .single();
        if (sendingProfileError) {
          return new ErrorResponseDto(400, sendingProfileError.message);
        }
        const sendingProfileData = sendingProfile as Profile;
        const paymentRequest: PaymentInitiateRequest = {
          amount: senderTransactionDto.amount,
          currency: 'ZWL',
          customerEmail: sendingProfileData.email,
          customerName: sendingProfileData.first_name,
          customerPhone: senderTransactionDto.receiving_phone,
          paymentMethod:
            senderTransactionDto.transfer_mode == 'ecocash'
              ? PaymentMethod.ECOCASH
              : senderTransactionDto.transfer_mode == 'omari'
                ? PaymentMethod.OMARI
                : senderTransactionDto.transfer_mode == 'innbucks'
                  ? PaymentMethod.INNBUCKS
                  : senderTransactionDto.transfer_mode == 'walletplus'
                    ? PaymentMethod.WALLETPLUS
                    : senderTransactionDto.transfer_mode == 'card'
                      ? PaymentMethod.CARD
                      : senderTransactionDto.transfer_mode == 'onemoney'
                        ? PaymentMethod.ONEMONEY
                        : PaymentMethod.ECOCASH,
          reference: sender.id,
          callbackUrl: `https://f309-41-173-239-81.ngrok-free.app/tradingservices/payment/callback`,
          // callbackUrl: `${process.env.API_BASE_URL}/tradingservices/payment/callback`,
        };

        // Initiate payment
        const paymentResponse =
          await paymentGateway.initiateExpressPayment(paymentRequest);
        this.logger.log(paymentResponse);
      }
      /*
      // this.logger.log(debitResponse);
      // this.logger.log(creditResponse);
      // send notification to the user
      */ return {
        statusCode: 201,
        message: 'Transaction created successfully',
        data: {
          message: senderTransactionDto,
          // transaction_id: data.id,
          // date: data.created_date,
          // new_balance: debitResponse['balance'] ?? 0.0,
        },
        // debitResponse,
        // creditResponse
      };
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async getCoopTotalContributions(
    wallet_id: string,
  ): Promise<number | ErrorResponseDto> {
    const { data, error } = await this.postgresrest.rpc(
      'get_total_contributions',
      { wallet_id },
    );
    if (error) {
      return new ErrorResponseDto(400, error.details);
    }
    if (!data) {
      return 0;
    }
    return Number(data);
  }

  async getCoopTotalSubscriptions(
    wallet_id: string,
  ): Promise<number | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.rpc(
        'get_total_subscriptions',
        { wallet_id },
      );
      if (error) {
        return new ErrorResponseDto(400, error.details);
      }
      if (!data) {
        return 0;
      }
      this.logger.debug(`Total subs paid for ${wallet_id}`);
      this.logger.debug(data);
      return Number(data);
    } catch (error) {
      this.logger.error(`Failed to fetch subscriptions: ${error}`);
      return new ErrorResponseDto(500, error);
    }
  }

  async getCoopTotalSubscriptionsZWG(
    wallet_id: string,
  ): Promise<number | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.rpc(
        'get_total_subscriptions_zwg',
        { wallet_id },
      );
      if (error) {
        return new ErrorResponseDto(400, error.details);
      }
      if (!data) {
        return 0;
      }
      this.logger.debug(`Total zwg subs paid for ${wallet_id}`);
      this.logger.debug(data);
      return Number(data);
    } catch (error) {
      this.logger.error(`Failed to fetch zwg subscriptions: ${error}`);
      return new ErrorResponseDto(500, error);
    }
  }

  async getCoopTotalContributionsZWG(
    wallet_id: string,
  ): Promise<number | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.rpc(
        'get_total_contributions_zwg',
        { wallet_id },
      );
      if (error) {
        return new ErrorResponseDto(400, error.details);
      }
      if (!data) {
        return 0;
      }
      this.logger.debug(`Total zwg contributions paid for ${wallet_id}`);
      this.logger.debug(data);
      return Number(data);
    } catch (error) {
      this.logger.error(`Failed to fetch zwg contributions: ${error}`);
      return new ErrorResponseDto(500, error);
    }
  }

  async getMemberTotalSubscriptions(
    coop_wallet_id: string,
    member_wallet_id: string,
    currency: string,
  ): Promise<number | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.rpc(
        'get_member_total_subscriptions',
        {
          p_coop_wallet_id: coop_wallet_id,
          p_member_wallet_id: member_wallet_id,
          p_currency: currency,
        },
      );
      if (error) {
        this.logger.debug(
          `coop_wallet_id: ${coop_wallet_id}\nmember_wallet_id: ${member_wallet_id}`,
        );
        this.logger.error(`Failed to get total subs: ${JSON.stringify(error)}`);
        return new ErrorResponseDto(400, error.details);
      }
      if (!data) {
        return 0;
      }
      this.logger.debug(`Total subs paid by ${member_wallet_id} ${data}`);
      return Number(data);
    } catch (error) {
      this.logger.error(`Failed to fetch subscriptions: ${error}`);
      return new ErrorResponseDto(500, error);
    }
  }

  async getCoopTotalsByCategory(
    wallet_id: string,
    category: string,
  ): Promise<number | ErrorResponseDto> {
    const { data, error } = await this.postgresrest.rpc(
      'get_transactions_total_by_category',
      { wallet_id: wallet_id, category: category },
    );
    if (error) {
      return new ErrorResponseDto(400, error.details);
    }
    if (!data) {
      return 0;
    }
    return data as number;
  }

  async findAllTransactions(): Promise<Transaction[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('super_admin_transactions')
        .select();

      if (error) {
        this.logger.error('Error fetching Transactions', error);
        return new ErrorResponseDto(400, error.details);
      }

      return data as Transaction[];
    } catch (error) {
      this.logger.error('Exception in findAllTransactions', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async findUserTransactions(
    wallet_id: string,
    logged_in_user_id: string,
    platform: string,
  ): Promise<object | ErrorResponseDto> {
    try {
      const slDto = new CreateSystemLogDto();
      slDto.profile_id = logged_in_user_id;
      slDto.platform = platform;
      slDto.action = 'Fetch user transactions';
      slDto.request = wallet_id;

      const { data, error } = await this.postgresrest.rpc(
        'fetch_user_transactions',
        { p_wallet_id: wallet_id },
      );
      if (error) {
        slDto.response = error;
        const { data: log, error: logError } = await this.postgresrest
          .from('system_logs')
          .insert(slDto)
          .select()
          .single();

        if (logError) {
          this.logger.error('Failed to create system log', logError);
          return new ErrorResponseDto(400, 'Failed to create log');
        }
        this.logger.warn('Log created', log);
        this.logger.error('Failed to fetch user transactions', error);
        return new ErrorResponseDto(
          400,
          'Failed to fetch user transactions',
          error,
        );
      }
      slDto.response = {
        statusCode: 200,
        message: 'User transactions fetched successfully',
      };
      const { data: log, error: logError } = await this.postgresrest
        .from('system_logs')
        .insert(slDto)
        .select()
        .single();

      if (logError) {
        this.logger.error('Failed to create system log', logError);
        return new ErrorResponseDto(400, 'Failed to create log');
      }
      this.logger.warn('Log created', log);
      return new SuccessResponseDto(
        200,
        'Transactions fetched successfully',
        data,
      );
    } catch (e) {
      this.logger.error('findUserTransactions error', e);
      return new ErrorResponseDto(500, 'findUserTransactions error', e);
    }
  }

  async fetchUserSubsAndContributions(
    member_wallet_id: string,
    coop_wallet_id,
    logged_in_user_id: string,
    platform: string,
  ): Promise<object | ErrorResponseDto> {
    try {
      const slDto = new CreateSystemLogDto();
      slDto.profile_id = logged_in_user_id;
      slDto.platform = platform;
      slDto.action = 'Fetch member subs and contributions';
      slDto.request = `?member_wallet_id=${member_wallet_id}&coop_wallet_id=${coop_wallet_id}`;

      const { data, error } = await this.postgresrest.rpc(
        'fetch_user_subs_and_contributions',
        {
          p_member_wallet_id: member_wallet_id,
          p_coop_wallet_id: coop_wallet_id,
        },
      );
      if (error) {
        slDto.response = error;
        const { data: log, error: logError } = await this.postgresrest
          .from('system_logs')
          .insert(slDto)
          .select()
          .single();

        if (logError) {
          this.logger.error('Failed to create system log', logError);
          return new ErrorResponseDto(400, 'Failed to create log');
        }
        this.logger.warn('Log created', log);
        this.logger.error('Failed to fetch user transactions', error);
        return new ErrorResponseDto(
          400,
          'Failed to fetch user transactions',
          error,
        );
      }
      slDto.response = {
        statusCode: 200,
        message: 'User transactions fetched successfully',
      };
      const { data: log, error: logError } = await this.postgresrest
        .from('system_logs')
        .insert(slDto)
        .select()
        .single();

      if (logError) {
        this.logger.error('Failed to create system log', logError);
        return new ErrorResponseDto(400, 'Failed to create log');
      }
      this.logger.warn('Log created', log);
      return new SuccessResponseDto(
        200,
        'Transactions fetched successfully',
        data,
      );
    } catch (e) {
      this.logger.error('findUserTransactions error', e);
      return new ErrorResponseDto(500, 'findUserTransactions error', e);
    }
  }

  async fetchMostRecentSenderTransaction(
    sending_wallet: string,
  ): Promise<object | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('transactions')
        .select(
          `*,
          transactions_sending_wallet_fkey(*,wallets_profile_id_fkey(*), wallets_group_id_fkey(*)), 
          transactions_receiving_wallet_fkey(*,wallets_profile_id_fkey(*), wallets_group_id_fkey(*))`,
        )
        .eq('sending_wallet', sending_wallet)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        this.logger.error('Error fetching most recent transaction', error);
        return new ErrorResponseDto(400, error.details);
      }

      return data as object;
    } catch (error) {
      this.logger.error('Exception in fetchMostRecentSenderTransaction', error);
      return new ErrorResponseDto(500, error);
    }
  }
  /*
  async fetchMostRecentBillPayment(
    phone: string,
  ): Promise<object | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('transactions')
        .select(
          `*,
          transactions_sending_wallet_fkey(*,wallets_profile_id_fkey(*), wallets_group_id_fkey(*)), 
          transactions_receiving_wallet_fkey(*,wallets_profile_id_fkey(*), wallets_group_id_fkey(*))`,
        )
        .eq('sending_wallet', sending_wallet)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        this.logger.error('Error fetching most recent transaction', error);
        return new ErrorResponseDto(400, error.details);
      }

      return data as object;
    } catch (error) {
      this.logger.error('Exception in fetchMostRecentSenderTransaction', error);
      return new ErrorResponseDto(500, error);
    }
  }
  */

  async streamTransactions(
    wallet_id: string,
    transaction_type: string,
  ): Promise<object | ErrorResponseDto> {
    try {
      this.logger.debug(
        `Streaming ${transaction_type} tansactions for wallet id ${wallet_id}`,
      );
      let queryBuilder = this.postgresrest.from('transactions').select();
      if (transaction_type != null) {
        queryBuilder = queryBuilder
          .eq('transaction_type', transaction_type)
          .or(
            `receiving_wallet.eq.${wallet_id},sending_wallet.eq.${wallet_id}`,
          );
      } else {
        queryBuilder = queryBuilder.or(
          `receiving_wallet.eq.${wallet_id},sending_wallet.eq.${wallet_id}`,
        );
      }
      const query = queryBuilder
        .select(
          `
        id, amount, currency, status, transaction_type, created_at, sending_wallet, receiving_wallet, member_id, 
        transactions_member_id_fkey(id, first_name, last_name),
        transactions_sending_wallet_fkey(
        id, profile_id, is_group_wallet, phone, coop_phone, 
        wallets_group_id_fkey(*), wallets_profile_id_fkey(*)),
        transactions_receiving_wallet_fkey(
        id, profile_id, is_group_wallet, phone, coop_phone, 
        wallets_group_id_fkey(*), wallets_profile_id_fkey(*))
        `,
        )
        .order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) {
        this.logger.error('Error fetching most recent transaction', error);
        return new ErrorResponseDto(400, error.details);
      }
      return data;
      /*
      const {data, error} = await this.postgresrest
      .from('transactions')
      .select()
      .eq('transaction_type', transaction_type)
      .or(`receiving_wallet.eq.${wallet_id},sending_wallet.eq.${wallet_id}`);
      */
    } catch (e) {
      this.logger.log(`streamTransactions error: ${e}`);
      return new ErrorResponseDto(500, e);
    }
  }

  async filterTransactions(
    transaction_type: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('transactions')
        .select()
        .eq('transaction_type', transaction_type);
      if (error) {
        return new ErrorResponseDto(400, error.details);
      }
      return new SuccessResponseDto(
        200,
        'Transactions fetched successfully',
        data as Transaction[],
      );
    } catch (e) {
      this.logger.log(`filterTransactions error: ${e}`);
      return new ErrorResponseDto(500, e);
    }
  }

  async viewTransaction(id: string): Promise<Transaction | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('transactions')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error fetching Transaction ${id}`, error);
        return new ErrorResponseDto(400, error.details);
      }

      return data as Transaction;
    } catch (error) {
      this.logger.error(`Exception in viewTransaction for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewWalletContributions(
    wallet_id: string,
  ): Promise<object | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('transactions')
        .select('sending_wallet, wallets(profile_id),profiles(*)')
        .eq('sending_wallet', wallet_id)
        .eq('transaction_type', 'contribution')
        .single();

      if (error) {
        this.logger.error(
          `Error fetching contribution for ${wallet_id}`,
          error,
        );
        return new ErrorResponseDto(400, error.details);
      }

      return data as object;
    } catch (error) {
      this.logger.error(
        `Exception in viewTransaction for id ${wallet_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async checkIfSubsPaid(
    group_wallet_id: string,
    child_wallet_id: string,
    month: string = new Date().toLocaleString('default', { month: 'long' }),
  ): Promise<boolean | ErrorResponseDto> {
    try {
      const currentYear = new Date().getFullYear();

      const { data, error } = await this.postgresrest
        .from('transactions')
        .select()
        .eq('sending_wallet', child_wallet_id)
        .eq('receiving_wallet', group_wallet_id)
        .eq('category', 'subscription')
        .filter(
          'created_at',
          'gte',
          new Date(`${month} 1, ${currentYear}`).toISOString(),
        )
        .filter(
          'created_at',
          'lte',
          new Date(`${month} 31, ${currentYear}`).toISOString(),
        )
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found
          return false;
        }
        this.logger.error(
          `Error checking subscription payment for ${month}`,
          error,
        );
        return new ErrorResponseDto(400, error.details);
      }

      return !!data; // Returns true if data exists, false otherwise
    } catch (error) {
      this.logger.error(
        `Exception checking subscription payment for ${month}`,
        error,
      );
      return new ErrorResponseDto(
        500,
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  async getWithdrawalsAndPayments(
    wallet_id: string,
    currency: string,
  ): Promise<number | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.rpc(
        'calculate_withdrawals',
        { p_wallet_id: wallet_id, p_currency: currency },
      );
      if (error) {
        return new ErrorResponseDto(400, error.details);
      }
      this.logger.debug(`Withdrawals and payments: $${data} ${currency}`);
      return Number(data);
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async generateTransactionReport(
    wallet_id: string,
  ): Promise<object | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.rpc(
        'get_comprehensive_transaction_report',
        {
          p_wallet_id: wallet_id,
          // p_period: 'January',
        },
      );

      if (error) {
        this.logger.error(`Error fetching financial report`, error);
        return new ErrorResponseDto(400, error.details);
      }
      this.logger.log(data.length);
      return data as object;
    } catch (error) {
      this.logger.error(`Exception in viewTransaction for id`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async fetchCoopEarnings(
    p_currency: string,
    logged_in_user_id: string,
    platform: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const slDto = new CreateSystemLogDto();
      slDto.profile_id = logged_in_user_id;
      slDto.platform = platform;
      slDto.action = 'Fetch cooperative earnings';
      slDto.request = `?currency=${p_currency}`;
      const { data, error } = await this.postgresrest.rpc(
        'fetch_coop_earnings',
        {
          p_currency: p_currency,
        },
      );
      if (error) {
        slDto.response = error;
        await this.postgresrest.from('system_logs').insert(slDto);
        this.logger.error('Failed to fetch cooperative earnings', error);
        return new ErrorResponseDto(
          400,
          'Failed to fetch cooperative earnings',
          error,
        );
      }
      slDto.response = {
        statusCode: 200,
        message: 'Cooperative earnings fetched successfully',
      };
      await this.postgresrest.from('system_logs').insert(slDto);
      return new SuccessResponseDto(
        200,
        'Cooperative earnings fetched successfully',
        data,
      );
    } catch (error) {
      this.logger.error('fetchCoopEarnings error', error);
      return new ErrorResponseDto(500, 'fetchCoopEarnings error', error);
    }
  }

  async fetchCoopEarningsDailyMTD(
    currency: string,
    logged_in_user_id: string,
    platform: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const slDto = new CreateSystemLogDto();
      slDto.profile_id = logged_in_user_id;
      slDto.platform = platform;
      slDto.action = 'Fetch cooperative earnings MTD daily';
      slDto.request = `?currency=${currency}`;
      const { data, error } = await this.postgresrest.rpc(
        'fetch_coop_earnings_daily_mtd',
        { p_currency: currency },
      );
      if (error) {
        slDto.response = error;
        await this.postgresrest.from('system_logs').insert(slDto);
        this.logger.error(
          'Failed to fetch cooperative earnings MTD daily',
          error,
        );
        return new ErrorResponseDto(
          400,
          'Failed to fetch cooperative earnings MTD daily',
          error,
        );
      }
      slDto.response = {
        statusCode: 200,
        message: 'Cooperative earnings MTD daily fetched successfully',
      };
      await this.postgresrest.from('system_logs').insert(slDto);
      return new SuccessResponseDto(
        200,
        'Cooperative earnings MTD daily fetched successfully',
        data,
      );
    } catch (error) {
      this.logger.error('fetchCoopEarningsDailyMTD error', error);
      return new ErrorResponseDto(
        500,
        'fetchCoopEarningsDailyMTD error',
        error,
      );
    }
  }

  async fetchCoopDisbursements(logged_in_user_id: string, platform: string) {
    try {
      const slDto = new CreateSystemLogDto();
      slDto.profile_id = logged_in_user_id;
      slDto.platform = platform;
      slDto.action = 'Fetch cooperative disbursements';
      slDto.request = ``;
      const { data, error } = await this.postgresrest
        .from('coop_disbursement_view_2')
        .select();
      if (error) {
        slDto.response = error;
        await this.postgresrest.from('system_logs').insert(slDto);
        this.logger.error('Failed to fetch cooperative disbursements', error);
        return new ErrorResponseDto(
          400,
          'Failed to fetch cooperative disbursements',
          error,
        );
      }
      slDto.response = {
        statusCode: 200,
        message: 'Cooperative disbursements fetched successfully',
      };
      await this.postgresrest.from('system_logs').insert(slDto);
      return new SuccessResponseDto(
        200,
        'Cooperative disbursements fetched successfully',
        data,
      );
    } catch (error) {
      this.logger.error('fetchCoopDisbursements error', error);
      return new ErrorResponseDto(500, 'fetchCoopDisbursements error', error);
    }
  }

  async fetchCoopDisbursementTotals(
    logged_in_user_id: string,
    platform: string,
  ) {
    try {
      const slDto = new CreateSystemLogDto();
      slDto.profile_id = logged_in_user_id;
      slDto.platform = platform;
      slDto.action = 'Fetch cooperative disbursement totals';
      slDto.request = ``;
      const { data, error } = await this.postgresrest
        .from('coop_disbursement_totals')
        .select();
      if (error) {
        slDto.response = error;
        await this.postgresrest.from('system_logs').insert(slDto);
        this.logger.error('Failed to fetch cooperative disbursements', error);
        return new ErrorResponseDto(
          400,
          'Failed to fetch cooperative disbursements',
          error,
        );
      }
      slDto.response = {
        statusCode: 200,
        message: 'Cooperative disbursements fetched successfully',
      };
      await this.postgresrest.from('system_logs').insert(slDto);
      return new SuccessResponseDto(
        200,
        'Cooperative disbursements fetched successfully',
        data,
      );
    } catch (error) {
      this.logger.error('fetchCoopDisbursements error', error);
      return new ErrorResponseDto(500, 'fetchCoopDisbursements error', error);
    }
  }

  async fetchCoopAnalytics(logged_in_user_id: string, platform: string) {
    try {
      const slDto = new CreateSystemLogDto();
      slDto.profile_id = logged_in_user_id;
      slDto.platform = platform;
      slDto.action = 'Fetch cooperative analytics';
      slDto.request = ``;
      const { data, error } = await this.postgresrest
        .from('coop_financial_analytics')
        .select();
      if (error) {
        slDto.response = error;
        await this.postgresrest.from('system_logs').insert(slDto);
        this.logger.error('Failed to fetch cooperative analytics', error);
        return new ErrorResponseDto(
          400,
          'Failed to fetch cooperative analytics',
          error,
        );
      }
      slDto.response = {
        statusCode: 200,
        message: 'Cooperative analytics fetched successfully',
      };
      await this.postgresrest.from('system_logs').insert(slDto);
      return new SuccessResponseDto(
        200,
        'Cooperative analytics fetched successfully',
        data,
      );
    } catch (error) {
      this.logger.error('fetchCoopAnalytics error', error);
      return new ErrorResponseDto(500, 'fetchCoopAnalytics error', error);
    }
  }

  async generateUserTransactionReport(
    wallet_id: string,
  ): Promise<object | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.rpc(
        'get_transaction_reports',
        {
          p_wallet_id: wallet_id,
          // p_period: 'January',
        },
      );

      if (error) {
        this.logger.error(`Error fetching user financial report`, error);
        return new ErrorResponseDto(400, error.details);
      }

      return data as object;
    } catch (error) {
      this.logger.error(`Exception in viewTransaction for id`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async generateCoopTransactionReport(
    wallet_id: string,
  ): Promise<object | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.rpc(
        'get_comprehensive_cooperative_transaction_report',
        {
          p_wallet_id: wallet_id,
          // p_period: 'January',
        },
      );

      if (error) {
        this.logger.error(`Error creating coop financial report`, error);
        return new ErrorResponseDto(400, error.details);
      }

      return data as object;
    } catch (error) {
      this.logger.error(`Exception in viewTransaction for id`, error);
      return new ErrorResponseDto(500, error);
    }
  }
}
