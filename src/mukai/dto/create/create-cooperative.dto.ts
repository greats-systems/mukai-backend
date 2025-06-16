import { IsString, IsOptional } from 'class-validator';

export class CreateCooperativeDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  admin_id: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsString()
  @IsOptional()
  category: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  logo: string;

  @IsString()
  @IsOptional()
  vision_statement: string;

  @IsString()
  @IsOptional()
  mission_statement: string;

  @IsString()
  @IsOptional()
  province_state: string;
}
