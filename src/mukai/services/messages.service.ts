function initLogger(funcname: Function): Logger {
  return new Logger(funcname.name);
}

@Injectable()
export class MessagesService {
  private readonly logger = initLogger(MessagesService.name);
  constructor(private readonly postgresrest: PostgresRest) { }

  async createMessage(
    createMessageDto: CreateMessageDto,
  ): Promise<Message | ErrorResponseDto> {
    try {
      /*
      const Message = new Message();

      Message.id ?: uuid;
      Message.handling_smart_contract ?: string;
      Message.is_collateral_required ?: boolean;
      Message.requesting_account ?: uuid;
      Message.offering_account ?: uuid;
      Message.collateral_Message_id ?: uuid;
      Message.payment_due ?: string;
      Message.payment_terms ?: string;
      Message.amount ?: string;
      Message.payments_handling_wallet_id ?: string;
      Message.collateral_Message_handler_id ?: uuid;
      Message.collateral_Message_handler_fee ?: string;

      Message.provider_id = createMessageDto.provider_id;
      Message.Message_name = createMessageDto.Message_name;
      Message.unit_measure = createMessageDto.unit_measure;
      Message.unit_price = createMessageDto.unit_price;
      Message.max_capacity = createMessageDto.max_capacity;

      // Check if the given Message already exists
      if (await this.checkIfProductExists(Message.provider_id)) {
        return new ErrorResponseDto(
          409,
          'You have already registered this Message',
        );
      }
        */

      const { data, error } = await this.postgresrest
        .from('messages')
        .insert(createMessageDto)
        .single();
      if (error) {
        console.log(error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as Message;
    } catch (error) {
      return new ErrorResponseDto(500, error);
    }
  }

  async findAllMessages(): Promise<Message[] | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('messages')
        .select();

      if (error) {
        this.logger.error('Error fetching Messages', error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Message[];
    } catch (error) {
      this.logger.error('Exception in findAllMessages', error);
      return new ErrorResponseDto(500, error);
    }
  }

  async viewMessage(
    id: string,
  ): Promise<Message | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('messages')
        .select()
        .eq('id', id);

      if (error) {
        this.logger.error(`Error fetching Message ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return data as Message[];
    } catch (error) {
      this.logger.error(
        `Exception in viewMessage for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async updateMessage(
    id: string,
    updateMessageDto: UpdateMessageDto,
  ): Promise<Message | ErrorResponseDto> {
    try {
      const { data, error } = await this.postgresrest
        .from('messages')
        .update(updateMessageDto)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        this.logger.error(`Error updating Messages ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }
      return data as Message;
    } catch (error) {
      this.logger.error(
        `Exception in updateMessage for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }

  async deleteMessage(
    id: string,
  ): Promise<boolean | ErrorResponseDto> {
    try {
      const { error } = await this.postgresrest
        .from('messages')
        .delete()
        .eq('id', id);

      if (error) {
        this.logger.error(`Error deleting Message ${id}`, error);
        return new ErrorResponseDto(400, error.message);
      }

      return true;
    } catch (error) {
      this.logger.error(
        `Exception in deleteMessage for id ${id}`,
        error,
      );
      return new ErrorResponseDto(500, error);
    }
  }
}