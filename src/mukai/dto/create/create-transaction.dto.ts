export class CreateTransactionDto {
    @IsString()
    @IsOptional()
    id: uuid;

    @IsString()
    @IsOptional()
    account_id: uuid;

    @IsNumber()
    @IsOptional()
    transaction_cost: int;

    @IsString()
    @IsOptional()
    transaction_type: string;

    @IsString()
    @IsOptional()
    category: string;

    @IsString()
    @IsOptional()
    created_date: string;

    @IsString()
    @IsOptional()
    amount: string;

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    owner: string;

    @IsString()
    @IsOptional()
    narrative: string;

    @IsString()
    @IsOptional()
    salt: string;

    @IsString()
    @IsOptional()
    receiving_wallet: uuid;

    @IsString()
    @IsOptional()
    sending_wallet: uuid;
}