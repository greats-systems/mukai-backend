import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateCooperativeMemberApprovalsDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  created_at?: string;

  @IsString()
  @IsOptional()
  group_id?: string;

  @IsInt()
  @IsOptional()
  number_of_members?: number;

  @IsInt()
  @IsOptional()
  supporting_votes?: number;

  @IsInt()
  @IsOptional()
  opposing_votes?: number;

  @IsString()
  @IsOptional()
  poll_description?: string;
}
