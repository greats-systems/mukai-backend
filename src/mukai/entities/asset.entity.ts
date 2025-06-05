export class Asset {
    id: string;
    holding_account: string;
        valuation_currency: string;
        fiat_value: number;
        token_value: number;
        governing_board: string;
        last_transaction_timestamp: string;
        verifiable_certificate_issuer_id: string;
        legal_documents: string;
        has_verifiable_certificate: boolean;
        is_valuated: boolean;
        is_minted: boolean;
        is_shared: boolean;
        is_active: boolean;
        has_document:bool;
        status: string;
        profile_id: string;
}
