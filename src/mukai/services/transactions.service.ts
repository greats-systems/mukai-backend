/* eslint-disable @typescript-eslint/no-unsafe-function-type */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateTransactionDto } from '../dto/create/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update/update-transaction.dto';
import { Transaction } from '../entities/transaction.entity';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class TransactionsService {
  private readonly logger = initLogger(TransactionsService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction | ErrorResponseDto> {
    try {
      /*
      const Transaction = new Transaction();

      Transaction.id ?: string;
      Transaction.handling_smart_contract ?: string;
      Transaction.is_collateral_required ?: boolean;
      Transaction.requesting_account ?: string;
      Transaction.offering_account ?: string;
      Transaction.collateral_Transaction_id ?: string;
      Transaction.payment_due ?: string;
      Transaction.payment_terms ?: string;
      Transaction.amount ?: string;
      Transaction.payments_handling_wallet_id ?: string;
      Transaction.collateral_Transaction_handler_id ?: string;
      Transaction.collateral_Transaction_handler_fee ?: string;

      Transaction.provider_id = createTransactionDto.provider_id;
      Transaction.Transaction_name = createTransactionDto.Transaction_name;
      Transaction.unit_measure = createTransactionDto.unit_measure;
      Transaction.unit_price = createTransactionDto.unit_price;
      Transaction.max_capacity = createTransactionDto.max_capacity;

      // Check if the given Transaction already exists
      if (await this.checkIfProductExists(Transaction.provider_id)) {
        return new ErrorResponseDto(
          409,
          'You have already registered this Transaction',
        );
      }
        */

      const { data, error } = await this.postgresrest
        .from('transactions')
        .insert(createTransactionDto)
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.message);
      }
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
