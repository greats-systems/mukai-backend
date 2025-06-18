/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateTransactionDto } from '../dto/create/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update/update-transaction.dto';
import { Transaction } from '../entities/transaction.entity';
import { WalletsService } from './wallets.service';
import { SuccessResponseDto } from 'src/common/dto/success-response.dto';
import { Wallet } from '../entities/wallet.entity';
import { PaymentInitiateRequest, PaymentMethod, SmilePayGateway } from 'src/common/zb_payment_gateway/payments';
import { Profile } from 'src/user/entities/user.entity';
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
  
  constructor(private readonly postgresrest: PostgresRest) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {

      const walletsService = new WalletsService(this.postgresrest);
      const { data, error } = await this.postgresrest
        .from('transactions')
        .insert(createTransactionDto)
        .select()
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.message);
      }
      console.log(data);
      const debitResponse = await walletsService.updateSenderBalance(
        createTransactionDto.sending_wallet,
        createTransactionDto.amount,
      );
      if( createTransactionDto.receiving_wallet){
      const creditResponse = await walletsService.updateReceiverBalance(
        createTransactionDto.receiving_wallet,
        createTransactionDto.amount,
      );
      }
      if( createTransactionDto.receiving_phone){
              // GET SENDING PROFILE
      const { data: sendingProfile, error: sendingProfileError } = await this.postgresrest
      .from('profiles')
      .select()
      .eq('id', createTransactionDto.account_id)
      .single();
    if(sendingProfileError){
      return new ErrorResponseDto(400, sendingProfileError.message);
    }
    const sendingProfileData = sendingProfile as Profile;
        const paymentRequest: PaymentInitiateRequest = {
          amount: createTransactionDto.amount,
          currency: 'ZWL',
          customerEmail: sendingProfileData.email,
          customerName: sendingProfileData.first_name,
          customerPhone: createTransactionDto.receiving_phone,
          paymentMethod: createTransactionDto.transfer_mode == 'ecocash' ? PaymentMethod.ECOCASH : createTransactionDto.transfer_mode == 'omari' ? PaymentMethod.OMARI : createTransactionDto.transfer_mode == 'innbucks' ? PaymentMethod.INNBUCKS : createTransactionDto.transfer_mode == 'walletplus' ? PaymentMethod.WALLETPLUS : createTransactionDto.transfer_mode == 'card' ? PaymentMethod.CARD : createTransactionDto.transfer_mode == 'onemoney' ? PaymentMethod.ONEMONEY : PaymentMethod.ECOCASH,
          reference: data.id,
          callbackUrl: `https://f309-41-173-239-81.ngrok-free.app/tradingservices/payment/callback`,
          // callbackUrl: `${process.env.API_BASE_URL}/tradingservices/payment/callback`,
        };
  
        // Initiate payment
        const paymentResponse = await paymentGateway.initiateExpressPayment(paymentRequest);
   console.log(paymentResponse);  
        }

      // console.log(debitResponse);
      // console.log(creditResponse);
      // send notification to the user

      return {
        statusCode: 201,
        message: 'Transaction created successfully',
        data: {
          transaction_id: data.id,
          date: data.created_date,
          new_balance: debitResponse['balance'] ?? 0.0,
        },
        // debitResponse,
        // creditResponse
      };
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
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
        'get_user_transaction_totals',
        {
          user_id: wallet_id,
        },
      );

      if (error) {
        this.logger.error(`Error fetching Transaction`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as object;
    } catch (error) {
      this.logger.error(`Exception in viewTransaction for id`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async updateTransaction(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('transactions')
        .update(updateTransactionDto)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating Transactions ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as Transaction;
    } catch (error) {
      this.logger.error(`Exception in updateTransaction for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteTransaction(id: string): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('transactions')
        .delete()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error deleting Transaction ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return true;
    } catch (error) {
      this.logger.error(`Exception in deleteTransaction for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }
}
