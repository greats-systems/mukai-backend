export class CreateOrganizationDto {
    @IsString()
    @IsOptional()
    id: uuid;

    @IsString()
    @IsOptional()
    trading_name: string;

    @IsString()
    @IsOptional()
    account_type: string;

    @IsString()
    @IsOptional()
    specialization: string;

    @IsString()
    @IsOptional()
    phone: string;

    @IsString()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    city: string;

    @IsString()
    @IsOptional()
    country: string;

    @IsString()
    @IsOptional()
    trading_license: string;

    @IsString()
    @IsOptional()
    status: string;
}
