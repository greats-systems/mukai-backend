import { PartialType } from '@nestjs/swagger';
import { CreateChatDto } from '../create/create-chat.dto';

export class UpdateChatDto extends PartialType(CreateChatDto) {}
