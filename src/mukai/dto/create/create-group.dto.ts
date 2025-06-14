import {
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { SignupDto } from 'src/auth/dto/signup.dto';

export class CreateGroupDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsUUID()
  @IsOptional()
  admin_id?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  monthly_sub?: number;

  @IsObject()
  @IsArray()
  @IsOptional()
  members?: SignupDto[];
}
