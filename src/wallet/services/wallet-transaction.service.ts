/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
// import { CreateWalletTransactionDto } from 'src/mukai/dto/create/create-transaction.dto';
import { WalletTransaction } from '../entities/wallet-transactions.entity';
import { CreateWalletTransactionDto } from '../dto/create/create-wallet-transaction.dto';
// import { UpdateWalletTransactionDto } from 'src/mukai/dto/update/update-transaction.dto';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class WalletTransactionService {
  private readonly logger = initLogger(WalletTransactionService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createWalletTransaction(
    createWalletTransactionDto: CreateWalletTransactionDto,
  ): Promise<WalletTransaction | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('zb_wallet_transactions')
        .insert(createWalletTransactionDto)
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as WalletTransaction;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllWalletTransactions(): Promise<
    WalletTransaction[] | ErrorResponseDto
  > {
    try {
      const { data, error } = await this.postgresrest
        .from('zb_wallet_transactions')
        .select()
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error('Error fetching subscribers', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as WalletTransaction[];
    } catch (error) {
      this.logger.error('Exception in findAllWalletTransaction', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewWalletTransaction(
    id: string,
  ): Promise<WalletTransaction[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('zb_wallet_transactions')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error fetching group ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as WalletTransaction[];
    } catch (error) {
      this.logger.error(
        `Exception in viewWalletTransaction for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }
}
