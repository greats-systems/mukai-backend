function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class CooperativeMemberRequestsService {
  private readonly logger = initLogger(CooperativeMemberRequestsService.name);
  constructor(private readonly postgresrest: PostgresRest) { }

  async createCooperativeMemberRequest(
    createCooperativeMemberRequestDto: CreateCooperativeMemberRequestDto,
  ): Promise<CooperativeMemberRequest | ErrorResponseDto> {
    try {
      /*
      const CooperativeMemberRequest = new CooperativeMemberRequest();

      CooperativeMemberRequest.id ?: uuid;
      CooperativeMemberRequest.handling_smart_contract ?: string;
      CooperativeMemberRequest.is_collateral_required ?: boolean;
      CooperativeMemberRequest.requesting_account ?: uuid;
      CooperativeMemberRequest.offering_account ?: uuid;
      CooperativeMemberRequest.collateral_CooperativeMemberRequest_id ?: uuid;
      CooperativeMemberRequest.payment_due ?: string;
      CooperativeMemberRequest.payment_terms ?: string;
      CooperativeMemberRequest.amount ?: string;
      CooperativeMemberRequest.payments_handling_wallet_id ?: string;
      CooperativeMemberRequest.collateral_CooperativeMemberRequest_handler_id ?: uuid;
      CooperativeMemberRequest.collateral_CooperativeMemberRequest_handler_fee ?: string;

      CooperativeMemberRequest.provider_id = createCooperativeMemberRequestDto.provider_id;
      CooperativeMemberRequest.CooperativeMemberRequest_name = createCooperativeMemberRequestDto.CooperativeMemberRequest_name;
      CooperativeMemberRequest.unit_measure = createCooperativeMemberRequestDto.unit_measure;
      CooperativeMemberRequest.unit_price = createCooperativeMemberRequestDto.unit_price;
      CooperativeMemberRequest.max_capacity = createCooperativeMemberRequestDto.max_capacity;

      // Check if the given CooperativeMemberRequest already exists
      if (await this.checkIfProductExists(CooperativeMemberRequest.provider_id)) {
        return new ErrorResponseDto(
          409,
          'You have already registered this CooperativeMemberRequest',
        );
      }
        */

      const { data, error } = await this.postgresrest
        .from('cooperative_member_requests')
        .insert(createCooperativeMemberRequestDto)
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as CooperativeMemberRequest;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllCooperativeMemberRequests(): Promise<CooperativeMemberRequest[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_requests')
        .select();

      if (error) {
        this.logger.error('Error fetching CooperativeMemberRequests', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as CooperativeMemberRequest[];
    } catch (error) {
      this.logger.error('Exception in findAllCooperativeMemberRequests', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewCooperativeMemberRequest(
    id: string,
  ): Promise<CooperativeMemberRequest | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_requests')
        .select()
        .eq('id', id);

      if (error) {
        this.logger.error(`Error fetching CooperativeMemberRequest ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as CooperativeMemberRequest[];
    } catch (error) {
      this.logger.error(
        `Exception in viewCooperativeMemberRequest for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async updateCooperativeMemberRequest(
    id: string,
    updateCooperativeMemberRequestDto: UpdateCooperativeMemberRequestDto,
  ): Promise<CooperativeMemberRequest | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('cooperative_member_requests')
        .update(updateCooperativeMemberRequestDto)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating CooperativeMemberRequests ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as CooperativeMemberRequest;
    } catch (error) {
      this.logger.error(
        `Exception in updateCooperativeMemberRequest for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteCooperativeMemberRequest(
    id: string,
  ): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('cooperative_member_requests')
        .delete()
        .eq('id', id);

      if (error) {
        this.logger.error(`Error deleting CooperativeMemberRequest ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Exception in deleteCooperativeMemberRequest for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }
}