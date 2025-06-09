/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Logger, Injectable } from '@nestjs/common';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { PostgresRest } from 'src/common/postgresrest';
import { CreateWalletDto } from '../dto/create/create-wallet.dto';
import { UpdateWalletDto } from '../dto/update/update-wallet.dto';
import { Wallet } from '../entities/wallet.entity';

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class WalletsService {
  private readonly logger = initLogger(WalletsService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createWallet(
    createWalletDto: CreateWalletDto,
  ): Promise<Wallet | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('wallets')
        .insert(createWalletDto)
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as Wallet;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllWallets(): Promise<Wallet[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.from('wallets').select();

      if (error) {
        this.logger.error('Error fetching Wallets', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Wallet[];
    } catch (error) {
      this.logger.error('Exception in findAllWallets', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewWallet(id: string): Promise<Wallet | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('wallets')
        .select()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error fetching Wallet ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Wallet;
    } catch (error) {
      this.logger.error(`Exception in viewWallet for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async updateWallet(
    id: string,
    updateWalletDto: UpdateWalletDto,
  ): Promise<Wallet | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('wallets')
        .update(updateWalletDto)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating Wallets ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as Wallet;
    } catch (error) {
      this.logger.error(`Exception in updateWallet for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteWallet(id: string): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('wallets')
        .delete()
        .eq('id', id)
        .single();

      if (error) {
        this.logger.error(`Error deleting Wallet ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return true;
    } catch (error) {
      this.logger.error(`Exception in deleteWallet for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }
}
