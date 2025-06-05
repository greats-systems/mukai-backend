function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class WalletsService {
  private readonly logger = initLogger(WalletsService.name);
  constructor(private readonly postgresrest: PostgresRest) { }

  async createWallet(
    createWalletDto: CreateWalletDto,
  ): Promise<Wallet | ErrorResponseDto> {
    try {
      /*
      const Wallet = new Wallet();

      Wallet.id ?: uuid;
      Wallet.handling_smart_contract ?: string;
      Wallet.is_collateral_required ?: boolean;
      Wallet.requesting_account ?: uuid;
      Wallet.offering_account ?: uuid;
      Wallet.collateral_Wallet_id ?: uuid;
      Wallet.payment_due ?: string;
      Wallet.payment_terms ?: string;
      Wallet.amount ?: string;
      Wallet.payments_handling_wallet_id ?: string;
      Wallet.collateral_Wallet_handler_id ?: uuid;
      Wallet.collateral_Wallet_handler_fee ?: string;

      Wallet.provider_id = createWalletDto.provider_id;
      Wallet.Wallet_name = createWalletDto.Wallet_name;
      Wallet.unit_measure = createWalletDto.unit_measure;
      Wallet.unit_price = createWalletDto.unit_price;
      Wallet.max_capacity = createWalletDto.max_capacity;

      // Check if the given Wallet already exists
      if (await this.checkIfProductExists(Wallet.provider_id)) {
        return new ErrorResponseDto(
          409,
          'You have already registered this Wallet',
        );
      }
        */

      const { data, error } = await this.postgresrest
        .from('wallets')
        .insert(createWalletDto)
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.Wallet);
      }
      return data as Wallet;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllWallets(): Promise<Wallet[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('wallets')
        .select();

      if (error) {
        this.logger.error('Error fetching Wallets', error);
        return new ErrorResponseDto(400, error.Wallet);
      }

      return data as Wallet[];
    } catch (error) {
      this.logger.error('Exception in findAllWallets', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewWallet(
    id: string,
  ): Promise<Wallet | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('wallets')
        .select()
        .eq('id', id);

      if (error) {
        this.logger.error(`Error fetching Wallet ${id}`, error);
        return new ErrorResponseDto(400, error.Wallet);
      }

      return data as Wallet[];
    } catch (error) {
      this.logger.error(
        `Exception in viewWallet for id ${id}`,
        error,
      );
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
        return new ErrorResponseDto(400, error.Wallet);
      }
      return data as Wallet;
    } catch (error) {
      this.logger.error(
        `Exception in updateWallet for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteWallet(
    id: string,
  ): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('wallets')
        .delete()
        .eq('id', id);

      if (error) {
        this.logger.error(`Error deleting Wallet ${id}`, error);
        return new ErrorResponseDto(400, error.Wallet);
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Exception in deleteWallet for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }
}