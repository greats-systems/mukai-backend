import { IsString, IsOptional } from 'class-validator';

export class CreateCooperativeMemberRequestDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  updated_at?: string;

  @IsString()
  @IsOptional()
  coop_id?: string;

  @IsString()
  @IsOptional()
  member_id?: string;

  @IsString()
  @IsOptional()
  request_type?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  resolved_by?: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsString()
  @IsOptional()
  profile_first_name?: string;

  @IsString()
  @IsOptional()
  profile_last_name?: string;

  @IsString()
  @IsOptional()
  most_recent_content?: string;

  @IsString()
  @IsOptional()
  most_recent_content_format?: string;

  @IsString()
  @IsOptional()
  group_id: string;
}
