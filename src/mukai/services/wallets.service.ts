/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Injectable, Logger } from "@nestjs/common";
import { ErrorResponseDto } from "src/common/dto/error-response.dto";
import { PostgresRest } from "src/common/postgresrest";
import { CreateWalletDto } from "../dto/create/create-wallet.dto";
import { UpdateWalletDto } from "../dto/update/update-wallet.dto";
import { Wallet } from "../entities/wallet.entity";
import { SuccessResponseDto } from "src/common/dto/success-response.dto";
import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto } from "../dto/create/create-transaction.dto";
import { UUID } from "crypto";

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class WalletsService {
  private readonly logger = initLogger(WalletsService);
  constructor(private readonly postgresrest: PostgresRest) {}

  async createWallet(
    createWalletDto: CreateWalletDto,
  ): Promise<SuccessResponseDto | object | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from("wallets")
        .upsert(createWalletDto, {
          onConflict: "profile_id,is_group_wallet,default_currency",
          ignoreDuplicates: true,
        })
        .select()
        .single();
      if (error) {
        console.log(error);
        if (error.details == "The result contains 0 rows") {
          return {
            data:
              `User ${createWalletDto.profile_id} cannot create a wallet of the same type`,
          };
        }
        return new ErrorResponseDto(400, error.message);
      }
      return {
        statusCode: 201,
        message: "Wallet created successfully",
        data: data as Wallet,
      };
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllWallets(): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest.from("wallets").select();

      if (error) {
        this.logger.error("Error fetching Wallets", error);
        return new ErrorResponseDto(400, error.message);
      }

      return {
        statusCode: 200,
        message: "Wallets fetched successfully",
        data: data as Wallet[],
      };
    } catch (error) {
      this.logger.error("Exception in findAllWallets", error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewWallet(id: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from("wallets")
        .select()
        .eq("profile_id", id);

      if (error) {
        this.logger.error(`Error fetching Wallet ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      console.log({
        statusCode: 200,
        message: "Wallet fetched successfully",
        data: data as Wallet[],
      });

      return {
        statusCode: 200,
        message: "Wallet fetched successfully",
        data: data as Wallet[],
      };
    } catch (error) {
      this.logger.error(`Exception in viewWallet for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewChildrenWallets(
    wallet_id: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from("wallets")
        .select()
        .eq("id", wallet_id)
        .eq("is_group_wallet", true);

      if (error) {
        this.logger.error(`Error fetching Wallet ${wallet_id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return {
        statusCode: 200,
        message: "Wallets fetched successfully",
        data: data as Wallet[],
      };
    } catch (error) {
      this.logger.error(`Exception in viewWallet for id ${wallet_id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewCooperativeWallet(
    cooperative_id: string,
    currency: string = "usd",
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from("wallets")
        .select()
        .eq("group_id", cooperative_id)
        .eq("default_currency", currency)
        .single();

      if (error) {
        this.logger.error(`Error fetching Wallet ${cooperative_id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return {
        statusCode: 200,
        message: "Wallet fetched successfully",
        data: data as Wallet,
      };
    } catch (error) {
      this.logger.error(
        `Exception in viewWallet for id ${cooperative_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async viewProfileWalletID(
    profile_id: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from("wallets")
        .select()
        .eq("profile_id", profile_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching Wallet ${profile_id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return {
        statusCode: 200,
        message: "Wallet fetched successfully",
        data: data as Wallet,
      };
    } catch (error) {
      this.logger.error(`Exception in viewWallet for id ${profile_id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async updateWallet(
    id: string,
    updateWalletDto: UpdateWalletDto,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from("wallets")
        .update(updateWalletDto)
        .eq("id", id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating Wallets ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }
      return {
        statusCode: 200,
        message: "Wallet updated successfully",
        data: data as Wallet,
      };
    } catch (error) {
      this.logger.error(`Exception in updateWallet for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async updateReceiverBalance(
    receiving_wallet_id: string,
    amount: number,
    currency: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    const transactionsService = new TransactionsService(this.postgresrest);
    const createTransactionDto = new CreateTransactionDto();
    try {
      const { data: balanceData, error: balanceError } = await this.postgresrest
        .from("wallets")
        .select("balance")
        .eq("id", receiving_wallet_id)
        .single();
      if (balanceError) {
        this.logger.error(
          `Error fetching balance ${receiving_wallet_id}`,
          balanceError,
        );
        return new ErrorResponseDto(400, balanceError.message);
      }
      const balance = parseFloat(balanceData["balance"]);
      const { data: updateData, error: updateError } = await this.postgresrest
        .from("wallets")
        .update({
          balance: balance + amount,
        })
        .eq("id", receiving_wallet_id)
        .select()
        .single();
      if (updateError) {
        this.logger.error(
          `Error fetching balance ${receiving_wallet_id}`,
          updateError,
        );
        return new ErrorResponseDto(400, updateError.message);
      }

      createTransactionDto.receiving_wallet = receiving_wallet_id as UUID;
      createTransactionDto.narrative = "credit";
      createTransactionDto.amount = amount;
      createTransactionDto.transaction_type = "internal transfer";
      createTransactionDto.currency = currency;

      const transactionResponse = await transactionsService.createTransaction(
        createTransactionDto,
      );
      console.log("updateSenderBalance transaction response");
      console.log(transactionResponse);

      return {
        statusCode: 200,
        message: "Wallet updated successfully",
        data: updateData as Wallet,
      };
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
    currency: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    const transactionsService = new TransactionsService(this.postgresrest);
    const createTransactionDto = new CreateTransactionDto();
    try {
      const { data: balanceData, error: balanceError } = await this.postgresrest
        .from("wallets")
        .select("balance")
        .eq("id", sending_wallet_id)
        .single();
      if (balanceError) {
        this.logger.error(
          `Error fetching balance ${sending_wallet_id}`,
          balanceError,
        );
        return new ErrorResponseDto(400, balanceError.message);
      }
      const balance = parseFloat(balanceData["balance"]);
      const { data: updateData, error: updateError } = await this.postgresrest
        .from("wallets")
        .update({
          balance: balance - amount,
        })
        .eq("id", sending_wallet_id)
        .select()
        .single();
      if (updateError) {
        this.logger.error(
          `Error fetching balance ${sending_wallet_id}`,
          updateError,
        );
        return new ErrorResponseDto(400, updateError.message);
      }

      createTransactionDto.sending_wallet = sending_wallet_id as UUID;
      createTransactionDto.narrative = "debit";
      createTransactionDto.amount = amount;
      createTransactionDto.transaction_type = "internal transfer";
      createTransactionDto.currency = currency;

      const transactionResponse = await transactionsService.createTransaction(
        createTransactionDto,
      );
      console.log("updateSenderBalance transaction response");
      console.log(transactionResponse);

      return {
        statusCode: 200,
        message: "Wallet updated successfully",
        data: updateData as Wallet,
      };
    } catch (error) {
      this.logger.error(
        `Exception in updateBalance for id ${sending_wallet_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteWallet(
    id: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from("wallets")
        .delete()
        .eq("id", id)
        .single();

      if (error) {
        this.logger.error(`Error deleting Wallet ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return {
        statusCode: 200,
        message: "Wallet deleted successfully",
      };
    } catch (error) {
      this.logger.error(`Exception in deleteWallet for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }
}
