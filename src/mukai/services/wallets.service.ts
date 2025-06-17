/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
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
        .select()
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

  async viewWallet(id: string): Promise<Wallet[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('wallets')
        .select()
        .eq('profile_id', id)
        // .eq('created_at', date_trunc('month'))
        // .single();

      if (error) {
        this.logger.error(`Error fetching Wallet ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Wallet[];
    } catch (error) {
      this.logger.error(`Exception in viewWallet for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewChildrenWallets(wallet_id: string): Promise<Wallet[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('wallets')
        .select('children_wallets')
        .eq('id', wallet_id)
        .eq('is_group_wallet', true);

      if (error) {
        this.logger.error(`Error fetching Wallet ${wallet_id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Wallet[];
    } catch (error) {
      this.logger.error(`Exception in viewWallet for id ${wallet_id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewGroupWallet(group_id: string, currency: string = 'usd'): Promise<Wallet | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('wallets')
        .select()
        .eq('group_id', group_id)
        .eq('default_currency', currency)
        .single();

      if (error) {
        this.logger.error(`Error fetching Wallet ${group_id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Wallet;
    } catch (error) {
      this.logger.error(`Exception in viewWallet for id ${group_id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewProfileWalletID(profile_id: string): Promise<object | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('wallets')
        .select('id')
        .eq('profile_id', profile_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching Wallet ${profile_id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as object;
    } catch (error) {
      this.logger.error(`Exception in viewWallet for id ${profile_id}`, error);
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

  async updateReceiverBalance(
    receiving_wallet_id: string,
    amount: number,
  ): Promise<Wallet | ErrorResponseDto> {
    try {
      const { data: balanceData, error: balanceError } = await this.postgresrest
        .from('wallets')
        .select('balance')
        .eq('id', receiving_wallet_id)
        .single();
      if (balanceError) {
        this.logger.error(
          `Error fetching balance ${receiving_wallet_id}`,
          balanceError,
        );
        return new ErrorResponseDto(400, balanceError.message);
      }
      const balance = parseFloat(balanceData['balance']);
      const { data: updateData, error: updateError } = await this.postgresrest
        .from('wallets')
        .update({
          balance: balance + amount,
        })
        .eq('id', receiving_wallet_id)
        .select()
        .single();
      if (updateError) {
        this.logger.error(
          `Error fetching balance ${receiving_wallet_id}`,
          updateError,
        );
        return new ErrorResponseDto(400, updateError.message);
      }

      return updateData as Wallet;
    } catch (error) {
      this.logger.error(
        `Exception in updateBalance for id ${receiving_wallet_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async updateSenderBalance(
    sending_wallet_id: string,
    amount: number,
  ): Promise<Wallet | ErrorResponseDto> {
    try {
      const { data: balanceData, error: balanceError } = await this.postgresrest
        .from('wallets')
        .select('balance')
        .eq('id', sending_wallet_id)
        .single();
      if (balanceError) {
        this.logger.error(
          `Error fetching balance ${sending_wallet_id}`,
          balanceError,
        );
        return new ErrorResponseDto(400, balanceError.message);
      }
      const balance = parseFloat(balanceData['balance']);
      const { data: updateData, error: updateError } = await this.postgresrest
        .from('wallets')
        .update({
          balance: balance - amount,
        })
        .eq('id', sending_wallet_id)
        .select()
        .single();
      if(updateError){
        this.logger.error(
          `Error fetching balance ${sending_wallet_id}`,
          updateError,
        );
        return new ErrorResponseDto(400, updateError.message);
      }

      return updateData as Wallet;
    } catch (error) {
      this.logger.error(
        `Exception in updateBalance for id ${sending_wallet_id}`,
        error,
      );
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
