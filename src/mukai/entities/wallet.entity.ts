export class Wallet {
    id: uuid;
    holding_account: string;
    address: string;
    status: string;
    balance: string;
    last_transaction_timestamp: string;
    parent_wallet_id: string;
    provider: string;
    default_currency: string;
    business_id: string;
    is_shared: bool;
    is_active: bool;
    is_sub_wallet: bool;
    profile_id: uuid;
    coop_id: uuid;
}