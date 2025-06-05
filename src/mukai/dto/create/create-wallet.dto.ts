export class CreateWalletDto {
    @IsStirng()
    @IsOptional()
    id: uuid;

    @IsStirng()
    @IsOptional()
    holding_account: string;

    @IsStirng()
    @IsOptional()
    address: string;

    @IsStirng()
    @IsOptional()
    status: string;

    @IsStirng()
    @IsOptional()
    balance: string;

    @IsStirng()
    @IsOptional()
    last_transaction_timestamp: string;

    @IsStirng()
    @IsOptional()
    parent_wallet_id: string;

    @IsStirng()
    @IsOptional()
    provider: string;

    @IsStirng()
    @IsOptional()
    default_currency: string;

    @IsStirng()
    @IsOptional()
    business_id: string;

    @IsBoolean()
    @IsOptional()
    is_shared: bool;

    @IsBoolean()
    @IsOptional()
    is_active: bool;

    @IsBoolean()
    @IsOptional()
    is_sub_wallet: bool;

    @IsStirng()
    @IsOptional()
    profile_id: uuid;

    @IsStirng()
    @IsOptional()
    coop_id: uuid;
}