import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContractBidDto {
  @IsString()
  @IsNotEmpty()
  contract_id: string;

  @IsString()
  @IsNotEmpty()
  provider_id: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  closing_date: string;

  @IsString()
  @IsOptional()
  award_date: string;

  @IsString()
  @IsOptional()
  awarded_to: string;
}
