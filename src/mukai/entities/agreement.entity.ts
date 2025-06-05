export class Agreement {
    id: string;
    handling_smart_contract: string;
    is_collateral_required: boolean;
    requesting_account: string;
    offering_account: string;
    collateral_asset_id: string;
    payment_due: string;
    payment_terms: string;
    amount: string;
    payments_handling_wallet_id: string;
    collateral_asset_handler_id: string;
    collateral_asset_handler_fee: string;
}