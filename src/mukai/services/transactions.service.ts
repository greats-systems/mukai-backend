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
// import { UUID } from 'crypto';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}
// const paymentGateway = new SmilePayGateway();
// const smileCashWalletService = new SmileCashWalletService();
// const smileCashWalletController = new SmileCashWalletController(
//   smileCashWalletService,
// );

@Injectable()
export class TransactionsService {
  private readonly logger = initLogger(TransactionsService);

  constructor(
    private readonly postgresrest: PostgresRest,
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
      const scwService = new SmileCashWalletService(this.postgresrest);
      /*When a transaction is initiated, 4 steps should take place:
       1. the initiator's transaction is recorded in the transactions table
       2. the initiator's wallet is debited
       3. the receiver's wallet is credited
       4 the receiver's credit is recorded in the transactions table

       When SmileCash money is transferred, the new balances of the sender and receiver should reflect accordingly
       */
      const walletsService = new WalletsService(
        this.postgresrest,
        // this.smileWalletService,
      );
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
      const scSenderResponse = await scwService.balanceEnquiry(scSenderParams);
      if (scSenderResponse instanceof GeneralErrorResponseDto) {
        this.logger.error(
          `Error in sender balance enquiry: ${JSON.stringify(scSenderResponse.errorObject)}`,
        );
        return scSenderResponse;
      }
      const senderResponse = await walletsService.updateSmileCashBalance(
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
        await scwService.balanceEnquiry(scReceiverParams);
      if (scReceiverResponse instanceof GeneralErrorResponseDto) {
        this.logger.error(
          `Error in receiver balance enquiry: ${JSON.stringify(scReceiverResponse.errorObject)}`,
        );
        return scReceiverResponse;
      }
      const receiverResponse = await walletsService.updateSmileCashBalance(
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

  async createP2PTransaction(
    senderTransactionDto: CreateTransactionDto,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const scwService = new SmileCashWalletService(this.postgresrest);
      /*When a transaction is initiated, 4 steps should take place:
       1. the initiator's transaction is recorded in the transactions table
       2. the initiator's wallet is debited
       3. the receiver's wallet is credited
       4 the receiver's credit is recorded in the transactions table

       When SmileCash money is transferred, the new balances of the sender and receiver should reflect accordingly
       */
      const walletsService = new WalletsService(
        this.postgresrest,
        // this.smileWalletService,
      );

      const request = {
        receiverMobile: senderTransactionDto.receiving_phone,
        senderPhone: senderTransactionDto.sending_phone,
        amount: senderTransactionDto.amount,
        currency: senderTransactionDto.currency,
        channel: senderTransactionDto.transfer_mode,
        narration: senderTransactionDto.transaction_type,
      };
      this.logger.warn('Initiating wallet to wallet transfer');
      const w2wResponse = await scwService.walletToWallet(
        request as WalletToWalletTransferRequest,
      );
      if (w2wResponse instanceof GeneralErrorResponseDto) {
        this.logger.error(
          `Error in wallet to wallet transfer: ${JSON.stringify(w2wResponse.errorObject)}`,
        );
        return w2wResponse;
      }
      this.logger.debug(
        `Wallet to wallet transfer response: ${JSON.stringify(w2wResponse)}`,
      );

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
      this.logger.debug(`Sender currency: ${senderTransactionDto.currency}`);
      this.logger.warn('Updating sender SmileCash balance');
      const scSenderResponse = await scwService.balanceEnquiry(scSenderParams);
      if (scSenderResponse instanceof GeneralErrorResponseDto) {
        this.logger.error(
          `Error in sender balance enquiry: ${JSON.stringify(scSenderResponse.errorObject)}`,
        );
        return scSenderResponse;
      }
      const senderResponse = await walletsService.updateSmileCashBalance(
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
        await scwService.balanceEnquiry(scReceiverParams);
      if (scReceiverResponse instanceof GeneralErrorResponseDto) {
        this.logger.error(
          `Error in receiver balance enquiry: ${JSON.stringify(scReceiverResponse.errorObject)}`,
        );
        return scReceiverResponse;
      }
      const receiverResponse = await walletsService.updateSmileCashBalance(
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

  async createSmilePayTransaction(
    senderTransactionDto: CreateTransactionDto,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const scwService = new SmileCashWalletService(this.postgresrest);
      /*When a transaction is initiated, 4 steps should take place:
       1. the initiator's transaction is recorded in the transactions table
       2. the initiator's wallet is debited
       3. the receiver's wallet is credited
       4 the receiver's credit is recorded in the transactions table

       When SmileCash money is transferred, the new balances of the sender and receiver should reflect accordingly
       */
      const walletsService = new WalletsService(
        this.postgresrest,
        // this.smileWalletService,
      );

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
      const scSenderResponse = await scwService.balanceEnquiry(scSenderParams);
      if (scSenderResponse instanceof GeneralErrorResponseDto) {
        this.logger.error(
          `Error in sender balance enquiry: ${JSON.stringify(scSenderResponse.errorObject)}`,
        );
        return scSenderResponse;
      }
      const senderResponse = await walletsService.updateSmileCashBalance(
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
        await scwService.balanceEnquiry(scReceiverParams);
      if (scReceiverResponse instanceof GeneralErrorResponseDto) {
        this.logger.error(
          `Error in receiver balance enquiry: ${JSON.stringify(scReceiverResponse.errorObject)}`,
        );
        return scReceiverResponse;
      }
      const receiverResponse = await walletsService.updateSmileCashBalance(
        senderTransactionDto.receiving_wallet,
        scReceiverResponse.data.data.billerResponse.balance,
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
        .from('transactions')
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
