export class Wallet {
  id: string;
  holding_account: string;
  address: string;
  status: string;
  balance: number;
  last_transaction_timestamp: string;
  parent_wallet_id: string;
  provider: string;
  default_currency: string;
  business_id: string;
  is_shared: boolean;
  is_active: boolean;
  is_sub_wallet: boolean;
  profile_id: string;
  coop_id: string;
}
