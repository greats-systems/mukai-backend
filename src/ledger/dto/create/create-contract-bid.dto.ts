import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateContractBidDto {
  @IsString()
  @IsNotEmpty()
  contract_id: string;

  @IsString()
  @IsNotEmpty()
  provider_id: string;

  @IsString()
  @IsNotEmpty()
  opening_date: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  // @IsNotEmpty()
  closing_date: string;

  @IsNumber()
  @IsNotEmpty()
  valued_at: number;

  @IsString()
  // @IsNotEmpty()
  award_date: string;

  @IsString()
  // @IsNotEmpty()
  awarded_to: string;
}
