export class CreateAgreementDto {
    @IsString()
    @IsOptional()
    id?: uuid;

    @IsString()
    @IsOptional()
    handling_smart_contract?: string;

    @IsString()
    @IsOptional()
    is_collateral_required?: boolean;

    @IsString()
    @IsOptional()
    requesting_account?: uuid;

    @IsString()
    @IsOptional()
    offering_account?: uuid;

    @IsString()
    @IsOptional()
    collateral_asset_id?: uuid;

    @IsString()
    @IsOptional()
    payment_due?: string;

    @IsString()
    @IsOptional()
    payment_terms?: string;

    @IsString()
    @IsOptional()
    amount?: string;

    @IsString()
    @IsOptional()
    payments_handling_wallet_id?: string;

    @IsString()
    @IsOptional()
    collateral_asset_handler_id?: uuid;

    @IsString()
    @IsOptional()
    collateral_asset_handler_fee?: string;
}