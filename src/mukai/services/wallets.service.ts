/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
import { BalanceEnquiryRequest } from "src/common/zb_smilecash_wallet/requests/transactions.requests";
import { SmileCashWalletService } from "src/common/zb_smilecash_wallet/services/smilecash-wallet.service";

function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class WalletsService {
  private readonly logger = initLogger(WalletsService);
  constructor(private readonly postgresrest: PostgresRest,
    // private readonly smileWalletService: SmileWalletService,
  ) { }

  async createWallet(
    createWalletDto: CreateWalletDto,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from("wallets")
        .insert(createWalletDto)
        .select()
        .single();

      if (error) {
        this.logger.log(error);
        if (error.details?.includes("The result contains 0 rows") || error.code === '23505') {
          return new ErrorResponseDto(403, `User ${createWalletDto.profile_id} cannot create a wallet of the same type`);
        }
        return new ErrorResponseDto(400, error.details || error.message);
      }

      this.logger.log(`Wallet creation data: ${JSON.stringify(data)}`);

      // Make SmileCash balance enquiry only if coop_phone is provided
      if (createWalletDto.coop_phone) {
        await this.performBalanceEnquiries(data.id, createWalletDto.coop_phone);
      }
      else if (createWalletDto.phone) {
        await this.performBalanceEnquiries(data.id, createWalletDto.phone);
      }

      return {
        statusCode: 201,
        message: "Wallet created successfully",
        data: data as Wallet,
      };
    } catch (error) {
      this.logger.error(`Error creating wallet: ${JSON.stringify(error)}`);
      return new ErrorResponseDto(500, error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private async performBalanceEnquiries(walletId: string, coopPhone: string): Promise<void> {
    const scwService = new SmileCashWalletService(this.postgresrest);

    const currencies = ['USD', 'ZWG'];
    const balancePromises: Promise<SuccessResponseDto | null>[] = [];

    // Create balance enquiry promises for both currencies
    for (const currency of currencies) {
      const balanceParams: BalanceEnquiryRequest = {
        transactorMobile: coopPhone,
        currency: currency,
        channel: 'USSD',
        transactionId: '',
      };

      const balancePromise = Promise.race<SuccessResponseDto | null>([
        scwService.balanceEnquiry(balanceParams),
        new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
      ]);

      balancePromises.push(balancePromise);
    }

    try {
      const balanceResults = await Promise.allSettled(balancePromises);
      const balances: Record<string, number | null> = { USD: null, ZWG: null };

      // Process balance results
      balanceResults.forEach((result, index) => {
        const currency = currencies[index];

        if (result.status === 'fulfilled' &&
          result.value instanceof SuccessResponseDto &&
          result.value.data?.data?.billerResponse?.balance !== undefined) {
          balances[currency] = result.value.data.data.billerResponse.balance;
        }
      });

      // Update wallet balances if we have at least one successful result
      this.logger.log(`Balances: ${balances.USD} ${balances.ZWG}`)
      if (balances.USD !== null || balances.ZWG !== null) {
        const updateDto = new UpdateWalletDto();
        updateDto.id = walletId;
        updateDto.balance = balances.USD!;
        updateDto.balance_zwg = balances.ZWG!;

        try {
          const walletResponse = await this.updateWallet(walletId, updateDto);
          this.logger.log(`Wallet balance update response: ${JSON.stringify(walletResponse)}`);
        } catch (updateError) {
          this.logger.error(`Error updating wallet balances: ${JSON.stringify(updateError)}`);
        }
      } else {
        this.logger.warn(`No successful balance enquiries for wallet ${walletId}`);
      }

    } catch (error) {
      this.logger.error(`Error during balance enquiries: ${JSON.stringify(error)}`);
    }
  }
  async findAllWallets(): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      this.logger.debug("Fetching all wallets");
      const { data, error } = await this.postgresrest
      .from("wallets")
      .select('*,profile_id(*)');

      if (error) {
        this.logger.error("Error fetching Wallets", error);
        return new ErrorResponseDto(400, error.details);
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

  async viewQRWallet(id: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from("wallets")
        .select('*, wallets_profile_id_fkey(*)')
        .eq("id", id)
        .eq('is_group_wallet', false)
      // .single();

      if (error) {
        this.logger.error(`Error fetching Wallet ${id}`, error);
        return new ErrorResponseDto(400, error.details);
      }
      // this.logger.log("Wallet data:", JSON.stringify(data));
      /*
      if (data[0].phone != null) {
        this.logger.debug(`Fetching SmileCash USD balance for ${data[0].phone}`);
        const scwService = new SmileCashWalletService(this.postgresrest);
        const walletPhone = data[0]?.phone;
        // USD balance enquiry
        const balanceEnquiryParamsUSD = {
          transactorMobile: walletPhone,
          currency: 'USD',
          channel: 'USSD',
          transactionId: ''
        } as BalanceEnquiryRequest;
        const balanceEnquiryResponseUSD = await scwService.balanceEnquiry(balanceEnquiryParamsUSD);
        if (balanceEnquiryResponseUSD instanceof SuccessResponseDto) {
          data[0].balance = balanceEnquiryResponseUSD.data.data.billerResponse.balance;
        }

        // ZWG balance enquiry
        this.logger.debug(`Fetching SmileCash ZWG balance for ${data[0].phone}`);
        const balanceEnquiryParamsZWG = {
          transactorMobile: walletPhone,
          currency: 'ZWG',
          channel: 'USSD',
          transactionId: ''
        } as BalanceEnquiryRequest;
        const balanceEnquiryResponseZWG = await scwService.balanceEnquiry(balanceEnquiryParamsZWG);
        if (balanceEnquiryResponseZWG instanceof SuccessResponseDto) {
          data[0].balance_zwg = balanceEnquiryResponseZWG.data.data.billerResponse.balance;
        }

        this.logger.log({
          statusCode: 200,
          message: "Wallet fetched successfully",
          data: data as Wallet[],
        });
      }
      */

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

  async viewWallet(id: string): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from("wallets")
        .select('*, wallets_profile_id_fkey(*)')
        .eq("profile_id", id)
        .eq('is_group_wallet', false)
      // .single();

      if (error) {
        this.logger.error(`Error fetching Wallet ${id}`, error);
        return new ErrorResponseDto(400, error.details);
      }
      this.logger.debug(`Wallet data:, ${JSON.stringify(data[0]['wallets_profile_id_fkey'])}`);
      
      if (data[0].phone != null) {
        this.logger.debug(`Fetching SmileCash USD balance for ${data[0].phone}`);
        const scwService = new SmileCashWalletService(this.postgresrest);
        const walletPhone = data[0]?.phone;
        const balanceEnquiryParamsUSD = {
          transactorMobile: walletPhone,
          currency: 'USD',
          channel: 'USSD',
          transactionId: ''
        } as BalanceEnquiryRequest;
        const balanceEnquiryResponseUSD = await scwService.balanceEnquiry(balanceEnquiryParamsUSD);
        if (balanceEnquiryResponseUSD instanceof SuccessResponseDto) {
          data[0].balance = balanceEnquiryResponseUSD.data.data.billerResponse.balance;
        } else {
          data[0].balance = 0.0;
        }

        this.logger.debug(`Fetching SmileCash ZWG balance for ${data[0].phone}`);
        const balanceEnquiryParamsZWG = {
          transactorMobile: walletPhone,
          currency: 'ZWG',
          channel: 'USSD',
          transactionId: ''
        } as BalanceEnquiryRequest;
        const balanceEnquiryResponseZWG = await scwService.balanceEnquiry(balanceEnquiryParamsZWG);
        if (balanceEnquiryResponseZWG instanceof SuccessResponseDto) {
          data[0].balance_zwg = balanceEnquiryResponseZWG.data.data.billerResponse.balance;
        } else {
          data[0].balance_zwg = 0.0;
        }
        

        this.logger.log({
          statusCode: 200,
          message: "Wallet fetched successfully",
          data: data as Wallet[],
        });
      }

      return {
        statusCode: 200,
        message: "Wallet fetched successfully",
        data,
      };
    } catch (error) {
      this.logger.error(`Exception in viewWallet for id ${id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewCoopWallet(
    coop_id: string,
  ): Promise<SuccessResponseDto | object | ErrorResponseDto> {
    this.logger.debug(`Fetching coop wallet for ${coop_id}`);
    try {
      const { data, error } = await this.postgresrest
        .from("wallets")
        .select('*,profile_id(*)')
        .eq("group_id", coop_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching coop Wallet ${coop_id}`, error);
        if (error.details == "The result contains 0 rows") {
          return { data: "No wallet found" };
        }
        return new ErrorResponseDto(400, error.details);
      }
      this.logger.log(`Coop data: ${JSON.stringify(data)}`);
      // this.logger.debug('Fetching SmileCash USD and ZWG Coop Wallet balance');
      const walletPhone = data?.coop_phone;
      const balanceEnquiryParams = {
        transactorMobile: walletPhone,
        currency: 'USD',
        channel: 'USSD',
        transactionId: ''
      } as BalanceEnquiryRequest;
      const scwService = new SmileCashWalletService(this.postgresrest);
      const balanceEnquiryResponse = await scwService.balanceEnquiry(balanceEnquiryParams);

      const balanceEnquiryParamsZWG = {
        transactorMobile: walletPhone,
        currency: 'ZWG',
        channel: 'USSD',
        transactionId: ''
      } as BalanceEnquiryRequest;
      const balanceEnquiryResponseZWG = await scwService.balanceEnquiry(balanceEnquiryParamsZWG);

      if (balanceEnquiryResponse instanceof SuccessResponseDto && balanceEnquiryResponseZWG instanceof SuccessResponseDto) {
        data.balance = balanceEnquiryResponse.data.data.billerResponse.balance;
        data.balance_zwg = balanceEnquiryResponseZWG.data.data.billerResponse.balance;
        const updateWalletDto = new UpdateWalletDto();
        updateWalletDto.id = data.id;
        updateWalletDto.balance = data.balance;
        updateWalletDto.balance_zwg = data.balance_zwg;
        await this.updateWallet(updateWalletDto.id!, updateWalletDto);
      }

      return {
        statusCode: 200,
        message: "Wallet fetched successfully",
        data: data as Wallet,
      };
    } catch (error) {
      this.logger.error(`Exception in viewCoopWallet for id ${coop_id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewIndividualWallets(
    profile_id: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from("wallets")
        .select('*,profile_id(*)')
        .eq("profile_id", profile_id)
        .eq("is_group_wallet", false);

      if (error) {
        this.logger.error(
          `Error fetching individual wallet ${profile_id}`,
          error,
        );
        return new ErrorResponseDto(400, error.details);
      }

      this.logger.log({
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
      this.logger.error(`Exception in viewIndividualWallets for id ${profile_id}`, error);
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
        return new ErrorResponseDto(400, error.details);
      }

      return {
        statusCode: 200,
        message: "Wallets fetched successfully",
        data: data as Wallet[],
      };
    } catch (error) {
      this.logger.error(`Exception in viewChildrenWallets for id ${wallet_id}`, error);
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
        return new ErrorResponseDto(400, error.details);
      }

      return {
        statusCode: 200,
        message: "Wallet fetched successfully",
        data: data as Wallet,
      };
    } catch (error) {
      this.logger.error(
        `Exception in viewCooperativeWallet for id ${cooperative_id}`,
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
        .eq("is_group_wallet", false)
        .single();

      if (error) {
        this.logger.error(`Error fetching Wallet ${profile_id}`, error);
        return new ErrorResponseDto(400, error.details);
      }

      return {
        statusCode: 200,
        message: "Wallet fetched successfully",
        data: data as Wallet,
      };
    } catch (error) {
      this.logger.error(`Exception in viewProfileWalletID for id ${profile_id}`, error);
      return new ErrorResponseDto(500, error);
    }
  }

  async getWalletsLike(id: string): Promise<Wallet[] | null> {
    try {
      // Convert to lowercase for case-insensitive searc
      const searchTerm = id.toLowerCase();

      const { data, error } = await this.postgresrest
        .from("wallets")
        .select("*, wallets_profile_id_fkey(*)")
        // Cast UUID to text for pattern matching
        .ilike("id_text", `%${searchTerm}%`)
        .single();

      if (error) {
        throw new Error(`Failed to fetch profiles: ${error.message}`);
      }
      this.logger.debug(data);

      return data as Wallet[];
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
        .select('*,profile_id(*)')
        .eq("id", wallet_id)
        .single();

      if (error) {
        this.logger.error(`Error fetching Wallet ${wallet_id}`, error);
        return new ErrorResponseDto(400, error.details);
      }
      // get profile
      const profile_id = data["profile_id"];
      const { data: profileData, error: profileError } = await this.postgresrest
        .from("profiles")
        .select("*")
        .eq("id", profile_id)
        .single();

      if (error) {
        throw new Error(`Failed to fetch profiles: ${profileError?.message}`);
      }
      this.logger.log("profileData", profileData);
      return {
        statusCode: 200,
        message: "Wallet Profile fetched successfully",
        data: profileData as Profile,
      };
    } catch (error) {
      this.logger.error(`Exception in getProfileByWalletID for id ${wallet_id}`, error);
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
        return new ErrorResponseDto(400, error.details);
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

  async updateSmileCashSenderBalance(
    sending_wallet_id: string,
    balance: number,
    currency: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    // const transactionsService = new TransactionsService(this.postgresrest);
    // const createTransactionDto = new CreateTransactionDto();
    try {
      this.logger.log("Updating SmileCash sender balance");
      if (currency == 'USD') {
        const { data: updateData, error: updateError } = await this.postgresrest
          .from("wallets")
          .update({
            balance: balance,
          })
          .eq("id", sending_wallet_id)
          .select()
          .single();
        if (updateError) {
          this.logger.error(
            `Error fetching sender balance ${sending_wallet_id}`,
            updateError,
          );
          return new ErrorResponseDto(400, updateError.message);
        }

        return {
          statusCode: 200,
          message: "USD sender wallet updated successfully",
          data: updateData as Wallet,
        };
      }
      const { data: updateData, error: updateError } = await this.postgresrest
        .from("wallets")
        .update({
          balance_zwg: balance,
        })
        .eq("id", sending_wallet_id)
        .select()
        .single();
      if (updateError) {
        this.logger.error(
          `Error fetching sender balance ${sending_wallet_id}`,
          updateError,
        );
        return new ErrorResponseDto(400, updateError.message);
      }

      return {
        statusCode: 200,
        message: "ZWG sender wallet updated successfully",
        data: updateData as Wallet,
      };

    } catch (error) {
      this.logger.error(
        `Exception in updateSmileCashSenderBalance for id ${sending_wallet_id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async updateSmileCashBalance(
    wallet_id: string,
    balance: number,
    currency: string,
  ): Promise<SuccessResponseDto | ErrorResponseDto> {
    // const transactionsService = new TransactionsService(this.postgresrest);
    // const createTransactionDto = new CreateTransactionDto();
    try {
      this.logger.log("Updating SmileCash balance");
      if (currency == 'USD') {
        const { data: updateData, error: updateError } = await this.postgresrest
          .from("wallets")
          .update({
            balance: balance,
          })
          .eq("id", wallet_id)
          .select()
          .single();
        if (updateError) {
          this.logger.error(
            `Error fetching USD balance ${wallet_id}`,
            updateError,
          );
          return new ErrorResponseDto(400, updateError.message);
        }
        // this.logger.log("New wallet:");
        // this.logger.log(updateData);

        return {
          statusCode: 200,
          message: "USD wallet updated successfully",
          data: updateData as Wallet,
        };
      }
      const { data: updateData, error: updateError } = await this.postgresrest
        .from("wallets")
        .update({
          balance_zwg: balance,
        })
        .eq("id", wallet_id)
        .select()
        .single();
      if (updateError) {
        this.logger.error(
          `Error fetching ZWG balance ${wallet_id}`,
          updateError,
        );
        return new ErrorResponseDto(400, updateError.message);
      }
      // this.logger.log("New wallet:");
      // this.logger.log(updateData);

      return {
        statusCode: 200,
        message: "ZWG wallet updated successfully",
        data: updateData as Wallet,
      };

    } catch (error) {
      this.logger.error(
        `Exception in updateSmileCashBalance for id ${wallet_id}`,
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
        return new ErrorResponseDto(400, error.details);
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
