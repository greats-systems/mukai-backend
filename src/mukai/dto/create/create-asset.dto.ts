export class CreatAssetDto {
    @IsString()
    @IsOptional()
    id?: uuid;

    @IsString()
    @IsOptional()
    holding_account?: string;

    @IsString()
    @IsOptional()
    valuation_currency?: string;

    @IsNumber()
    @IsOptional()
    fiat_value?: double;

    @IsNumber()
    @IsOptional()
    token_value?: double;

    @IsString()
    @IsOptional()
    governing_board?: text;

    @IsString()
    @IsOptional()
    last_transaction_timestamp?: string;

    @IsString()
    @IsOptional()
    verifiable_certificate_issuer_id?: string;

    @IsString()
    @IsOptional()
    legal_documents?: string;

    @IsBoolean()
    @IsOptional()
    has_verifiable_certificate?: bool;

    @IsBoolean()
    @IsOptional()
    is_valuated?: bool;

    @IsBoolean()
    @IsOptional()
    is_minted?: bool;

    @IsBoolean()
    @IsOptional()
    is_shared?: bool;

    @IsBoolean()
    @IsOptional()
    is_active?: bool;

    @IsBoolean()
    @IsOptional()
    has_document?: bool;

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    profile_id?: uuid;
}
