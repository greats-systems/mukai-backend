/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Injectable, Logger } from "@nestjs/common";
import { ErrorResponseDto } from "src/common/dto/error-response.dto";
import { PostgresRest } from "src/common/postgresrest";
import { UpdateWalletDto } from "../dto/update/update-wallet.dto";
import { Wallet } from "../entities/wallet.entity";
import { SuccessResponseDto } from "src/common/dto/success-response.dto";
import { Profile } from "src/user/entities/user.entity";
import { SmileWalletService } from "src/wallet/services/zb_digital_wallet.service";
import e from "express";
import { CreateSavingsDto, SavingsPortfolioDto } from "../dto/create/create-wallet-savings.dto";

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class SavingsService {
  private readonly logger = initLogger(SavingsService);
  constructor(private readonly postgresrest: PostgresRest,
    private readonly smileWalletService: SmileWalletService,
  ) { }

  async createSavingsPortfolio(
    createSavingsDto: CreateSavingsDto,
  ): Promise<SuccessResponseDto | object | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from("wallets")
        .upsert(createSavingsDto, {
          onConflict: "wallet_id,is_group_wallet,default_currency",
          ignoreDuplicates: true,
        })
        .select()
        .single();
      if (error) {
        console.log(error);
        if (error.details == "The result contains 0 rows") {
          return {
            data:
              `User ${createSavingsDto.wallet_id} cannot create a wallet of the same type`,
          };
        }
        return new ErrorResponseDto(400, error.message);
      }
      // get wallet profile

      // Create profile in public.profiles
      const { error: profileError, data: profileData } = await this.postgresrest
        .from('profiles')
        .select('*').eq('id', createSavingsDto.wallet_id).single();
      if (profileError) {
        this.logger.error(`Error fetching profile ${createSavingsDto.wallet_id}`, profileError);
      }
      this.logger.log(`Profile creation profileData: ${JSON.stringify(profileData)}`);
      // Call SmileWalletService to create a wallet in the digital wallet system
      const smileWalletResponse = await this.smileWalletService.createSubscriber({
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        mobile: profileData.phone,
        dateOfBirth: profileData.date_of_birth,
        idNumber: profileData.national_id_number,
        gender: profileData.gender.toUpperCase() ?? 'MALE',
        source: 'MkandoWallet',
      });

      if (smileWalletResponse != null) {
        this.logger.log(`Native Wallet data: ${JSON.stringify(data)}`);
        await this.postgresrest
          .from("wallets")
          .update({
            is_smile_cash_activated: true,
          })
          .eq("id", data.id);
        this.logger.log('Smile Wallet Activated');

      } else {
        this.logger.error('Smile Wallet Not Activated');
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

  async viewSavingsPortfolio(id: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from("wallets")
        .select()
        .eq("wallet_id", id);

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

  async viewCoopSavingsProfiles(
    coop_id: string,
  ): Promise<SuccessResponseDto | object | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from("wallets")
        .select()
        .eq("group_id", coop_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching coop Wallet ${coop_id}`, error);
        if (error.details == "The result contains 0 rows") {
          return { data: "No wallet found" };
        }
        return new ErrorResponseDto(400, error.message);
      }

      console.log({
        statusCode: 200,
        message: "Wallet fetched successfully",
        data: data as Wallet,
      });

      return {
        statusCode: 200,
        message: "Wallet fetched successfully",
        data: data as Wallet,
      };
    } catch (error) {
      this.logger.error(`Exception in viewWallet for id ${coop_id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewIndividualSavingsProfiles(
    profile_id: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from("savings_portfolios")
        .select()
        .eq("profile_id", profile_id);

      if (error) {
        this.logger.error(
          `Error fetching profile savings portfolios ${profile_id}`,
          error,
        );
        return new ErrorResponseDto(400, error.message);
      }

      console.log({
        statusCode: 200,
        message: "Portfolio fetched successfully",
        data: data as SavingsPortfolioDto[],
      });

      return {
        statusCode: 200,
        message: "Portfolio fetched successfully",
        data: data as SavingsPortfolioDto[],
      };
    } catch (error) {
      this.logger.error(`Exception in Portfolio for id ${profile_id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }




  async viewWalletProfileSavings(
    wallet_id: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from("savings_portfolios")
        .select()
        .eq("wallet_id", wallet_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching Wallet ${wallet_id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return {
        statusCode: 200,
        message: "Wallet fetched successfully",
        data: data as Wallet,
      };
    } catch (error) {
      this.logger.error(`Exception in viewWallet for id ${wallet_id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async getWalletsLike(id: string): Promise<Wallet | null> {
    try {
      // Convert to lowercase for case-insensitive searc
      const searchTerm = id.toLowerCase();

      const { data, error } = await this.postgresrest
        .from("wallets")
        .select("*")
        // Cast UUID to text for pattern matching
        .ilike("id_text", `%${searchTerm}%`)
        .single();

      if (error) {
        throw new Error(`Failed to fetch profiles: ${error.message}`);
      }

      return data as Wallet;
    } catch (error) {
      // this.logger.error(`Error in getProfilesLike: ${error}`);
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while searching profiles",
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
      const { data: profileData, error: profileError } = await this.postgresrest
        .from("profiles")
        .select("*")
        .eq("wallet_id", wallet_id)
        .single();

      if (error) {
        throw new Error(`Failed to fetch profiles: ${profileError?.message}`);
      }
      console.log("profileData", profileData);
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
    // const transactionsService = new TransactionsService(this.postgresrest);
    // const createTransactionDto = new CreateTransactionDto();
    try {
      console.log("Updating sender balance");
      const { data: balanceData, error: balanceError } = await this.postgresrest
        .from("wallets")
        .select("balance")
        .eq("id", sending_wallet_id)
        .single();
      console.log(balanceData);
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
      console.log("New wallet:");
      console.log(updateData);

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
