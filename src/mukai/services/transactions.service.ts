/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateTransactionDto } from '../dto/create/create-transaction.dto';
import { Transaction } from '../entities/transaction.entity';
import { WalletsService } from './wallets.service';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
// import { Wallet } from '../entities/wallet.entity';
import {
  PaymentInitiateRequest,
  PaymentMethod,
  SmilePayGateway,
} from 'src/common/zb_payment_gateway/payments';
import { Profile } from 'src/user/entities/user.entity';
import { SmileWalletService } from 'src/wallet/services/zb_digital_wallet.service';
// import { UUID } from 'crypto';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}
const paymentGateway = new SmilePayGateway(
  process.env.SMILEPAY_BASE_URL ?? '',
  process.env.SMILEPAY_API_KEY ?? '',
);
@Injectable()
export class TransactionsService {
  private readonly logger = initLogger(TransactionsService);

  constructor(
    private readonly postgresrest: PostgresRest,
    private readonly smileWalletService: SmileWalletService,
  ) {}

  async createTransaction(
    senderTransactionDto: CreateTransactionDto,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      /*When a transaction is initiated, 4 steps should take place:
       1. the initiator's transaction is recorded in the transactions table
       2. the initiator's wallet is debited
       3. the receiver's wallet is credited
       4 the receiver's credit is recorded in the transactions table
       */
      const walletsService = new WalletsService(
        this.postgresrest,
        this.smileWalletService,
      );
      // wall

      const receiverTransactionDto = new CreateTransactionDto();
      const { data: sender, error: senderError } = await this.postgresrest
        .from('transactions')
        .insert(senderTransactionDto)
        .select()
        .single();
      if (senderError) {
        console.log(senderError);
        return new ErrorResponseDto(400, senderError.message);
      }
      // console.log(sender);
      this.logger.warn('Updating sender wallet');

      const debitResponse = await walletsService.updateSenderBalance(
        senderTransactionDto.sending_wallet,
        senderTransactionDto.amount,
      );
      console.log(debitResponse);
      this.logger.warn('Updating receiver wallet');
      const creditResponse = await walletsService.updateReceiverBalance(
        senderTransactionDto.receiving_wallet,
        senderTransactionDto.amount,
      );
      console.log(creditResponse);

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
        console.log(receiverError);
        return new ErrorResponseDto(400, receiverError.message);
      }
      console.log(receiver);

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
        console.log(paymentResponse);
      }
      /*
      // console.log(debitResponse);
      // console.log(creditResponse);
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
      return new ErrorResponseDto(400, error.message);
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
        return new ErrorResponseDto(400, error.message);
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

  async getCoopTotalsByCategory(
    wallet_id: string,
    category: string,
  ): Promise<number | ErrorResponseDto> {
    const { data, error } = await this.postgresrest.rpc(
      'get_transactions_total_by_category',
      { wallet_id: wallet_id, category: category },
    );
    if (error) {
      return new ErrorResponseDto(400, error.message);
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
        return new ErrorResponseDto(400, error.message);
      }

      return data as Transaction[];
    } catch (error) {
      this.logger.error('Exception in findAllTransactions', error);
      return new ErrorResponseDto(500, error);
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
        return new ErrorResponseDto(400, error.message);
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
        return new ErrorResponseDto(400, error.message);
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
        return new ErrorResponseDto(400, error.message);
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
        return new ErrorResponseDto(400, error.message);
      }
      console.log(data.length);
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
        'get_comprehensive_individual_transaction_report',
        {
          p_wallet_id: wallet_id,
          // p_period: 'January',
        },
      );

      if (error) {
        this.logger.error(`Error fetching user financial report`, error);
        return new ErrorResponseDto(400, error.message);
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
        return new ErrorResponseDto(400, error.message);
      }

      return data as object;
    } catch (error) {
      this.logger.error(`Exception in viewTransaction for id`, error);
      return new ErrorResponseDto(500, error);
    }
  }
}
