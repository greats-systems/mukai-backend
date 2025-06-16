import { PartialType } from '@nestjs/swagger';
import { CreateMessageDto } from '../create/create-message.dto';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}
