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
// import { UUID } from 'crypto';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class TransactionsService {
  private readonly logger = initLogger(TransactionsService);
  constructor(
    private readonly postgresrest: PostgresRest,
    private readonly walletsService: WalletsService,
  ) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction | ErrorResponseDto> {
    try {
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
      const debitResponse = await this.walletsService.updateSenderBalance(
        createTransactionDto.sending_wallet,
        createTransactionDto.amount,
      );
      const creditResponse = await this.walletsService.updateReceiverBalance(
        createTransactionDto.receiving_wallet,
        createTransactionDto.amount,
      );
      console.log(debitResponse);
      console.log(creditResponse);
      return data as Transaction;
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

  async generateTransactionReport(
    wallet_id: string,
    parameters: object,
  ): Promise<object | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.rpc(
        'get_wallet_transactions',
        {
          p_wallet_id: wallet_id,
          p_period: parameters['period'],
          p_trans_type: parameters['transaction_type'],
          p_currency_filter: parameters['currency'],
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
