export class Transaction {
    id: uuid;
    account_id: uuid;
    transaction_cost: int;
    transaction_type: string;
    category: string;
    created_date: string;
    amount: string;
    name: string;
    owner: string;
    narrative: string;
    salt: string;
    receiving_wallet: uuid;
    sending_wallet: uuid;
}