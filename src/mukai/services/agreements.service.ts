function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class AgreementsService {
  private readonly logger = initLogger(AgreementsService.name);
  constructor(private readonly postgresrest: PostgresRest) { }

  async createAgreement(
    createAgreementDto: CreateAgreementDto,
  ): Promise<Agreement | ErrorResponseDto> {
    try {
      /*
      const agreement = new Agreement();

      agreement.id ?: uuid;
      agreement.handling_smart_contract ?: string;
      agreement.is_collateral_required ?: boolean;
      agreement.requesting_account ?: uuid;
      agreement.offering_account ?: uuid;
      agreement.collateral_asset_id ?: uuid;
      agreement.payment_due ?: string;
      agreement.payment_terms ?: string;
      agreement.amount ?: string;
      agreement.payments_handling_wallet_id ?: string;
      agreement.collateral_asset_handler_id ?: uuid;
      agreement.collateral_asset_handler_fee ?: string;

      agreement.provider_id = createAgreementDto.provider_id;
      agreement.agreement_name = createAgreementDto.agreement_name;
      agreement.unit_measure = createAgreementDto.unit_measure;
      agreement.unit_price = createAgreementDto.unit_price;
      agreement.max_capacity = createAgreementDto.max_capacity;

      // Check if the given agreement already exists
      if (await this.checkIfProductExists(agreement.provider_id)) {
        return new ErrorResponseDto(
          409,
          'You have already registered this agreement',
        );
      }
        */

      const { data, error } = await this.postgresrest
        .from('agreements')
        .insert(createAgreementDto)
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as Agreement;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllAgreements(): Promise<Agreement[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('agreements')
        .select();

      if (error) {
        this.logger.error('Error fetching agreements', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Agreement[];
    } catch (error) {
      this.logger.error('Exception in findAllAgreements', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewAgreement(
    id: string,
  ): Promise<Agreement[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('agreements')
        .select()
        .eq('id', id);

      if (error) {
        this.logger.error(`Error fetching agreement ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Agreement[];
    } catch (error) {
      this.logger.error(
        `Exception in viewAgreement for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async updateAgreement(
    id: string,
    updateAgreementDto: UpdateAgreementDto,
  ): Promise<Agreement | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('agreements')
        .update(updateAgreementDto)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating agreements ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as Agreement;
    } catch (error) {
      this.logger.error(
        `Exception in updateAgreement for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteAgreement(
    id: string,
  ): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('agreements')
        .delete()
        .eq('id', id);

      if (error) {
        this.logger.error(`Error deleting agreement ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Exception in deleteAgreement for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }
}