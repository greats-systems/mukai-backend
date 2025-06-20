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
import { Profile } from "src/user/entities/user.entity";

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
        .upsert(createWalletDto, {onConflict: 'profile_id,is_group_wallet,default_currency', ignoreDuplicates: true,})
        .select()
        .single();
      if (error) {
        console.log(error);
        if (error.details == 'The result contains 0 rows') {
          return {
            data: `User ${createWalletDto.profile_id} cannot create a wallet of the same type`,
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
        .eq("profile_id", id)
        .eq("is_group_wallet", false);
        // .single();

      // .eq('created_at', date_trunc('month'))
      // .single();

      if (error) {
        if (error.code == "PGRST116") {
          return {
            statusCode: 404,
            message: `No wallet found for ${id}`,
            data: null,
          }
        }
        else {
          this.logger.error(`Error fetching Wallet ${id}`, error);
          return new ErrorResponseDto(400, error.message);
        }
      }

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

  async getProfilesLikeWalletID(id: string): Promise<Profile[]> {
    try {
      // Convert to lowercase for case-insensitive searc
      const searchTerm = id.toLowerCase();

      const { data, error } = await this.postgresrest
        .from('wallets')
        .select('*')
        // Cast UUID to text for pattern matching
        .ilike('id_text', `%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch profiles: ${error.message}`);
      }

      return data?.length ? (data as Profile[]) : [];
    } catch (error) {
      // this.logger.error(`Error in getProfilesLike: ${error}`);
      throw new Error(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while searching profiles',
      );
    }
  }
  async getProfileByWalletID(
    wallet_id: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from("wallets")
        .select()
        .eq("id", wallet_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching Wallet ${wallet_id}`, error);
        return new ErrorResponseDto(400, error.message);
      }
      // get profile
      const profile_id = data['profile_id'];
      const { data: profileData, error: profileError } = await this.postgresrest
        .from('profiles')
        .select('*')
        .eq('id', profile_id)
        .single();

    if (error) {
      throw new Error(`Failed to fetch profiles: ${profileError?.message}`);
    }
    console.log('profileData', profileData)
      return {
        statusCode: 200,
        message: "Wallet Profile fetched successfully",
        data: profileData as Profile,
      };
    } catch (error) {
      this.logger.error(`Exception in viewWallet for id ${wallet_id}`, error);
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
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
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
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
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
