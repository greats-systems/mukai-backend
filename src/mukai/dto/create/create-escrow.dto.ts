import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateEscrowDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  created_at: string;

  @IsString()
  @IsOptional()
  escrow_name: string;

  @IsString()
  @IsOptional()
  wallet_id: string;

  @IsBoolean()
  @IsOptional()
  authorize_transaction: boolean;
}
