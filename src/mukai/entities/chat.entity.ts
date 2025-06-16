import { IsUUID, IsString, IsOptional } from 'class-validator';

export class Chat {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  ref_key?: string;

  @IsOptional()
  @IsUUID()
  receiver_id?: string;

  @IsOptional()
  @IsUUID()
  receiver_avatar_id?: string;

  @IsOptional()
  @IsString()
  receiver_first_name?: string;

  @IsOptional()
  @IsString()
  receiver_last_name?: string;

  @IsOptional()
  @IsUUID()
  profile_id?: string;

  @IsOptional()
  @IsUUID()
  profile_avatar_id?: string;

  @IsOptional()
  @IsString()
  profile_first_name?: string;

  @IsOptional()
  @IsString()
  profile_last_name?: string;

  @IsOptional()
  @IsString()
  most_recent_content?: string;

  @IsOptional()
  @IsString()
  most_recent_content_format?: string;
}
