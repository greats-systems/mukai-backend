export class Asset {
    id: uuid;
    holding_account: string;
        valuation_currency: string;
        fiat_value: double;
        token_value: double;
        governing_board: text;
        last_transaction_timestamp: string;
        verifiable_certificate_issuer_id: string;
        legal_documents: string;
        has_verifiable_certificate: bool;
        is_valuated: bool;
        is_minted: bool;
        is_shared: bool;
        is_active: bool;
        has_document:bool;
        status: string;
        profile_id: uuid;
}
