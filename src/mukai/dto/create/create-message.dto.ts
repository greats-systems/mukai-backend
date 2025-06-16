import { IsString, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  profile_id: string;

  @IsString()
  @IsOptional()
  content: string;

  @IsString()
  @IsOptional()
  content_format: string;

  @IsString()
  @IsOptional()
  message_timestamp: string;

  @IsString()
  @IsOptional()
  ref_key: string;

  @IsString()
  @IsOptional()
  chat_id: string;
}
