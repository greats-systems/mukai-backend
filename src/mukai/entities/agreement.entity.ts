export class Agreement {
    id: uuid;
    handling_smart_contract: string;
    is_collateral_required: boolean;
    requesting_account: uuid;
    offering_account: uuid;
    collateral_asset_id: uuid;
    payment_due: string;
    payment_terms: string;
    amount: string;
    payments_handling_wallet_id: string;
    collateral_asset_handler_id: uuid;
    collateral_asset_handler_fee: string;
}