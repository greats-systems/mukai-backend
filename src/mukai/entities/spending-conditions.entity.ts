export class SpendingConditions {
  id: string;
  created_at: string;
  target_amount: number;
  target_date: Date;
  milestone: string;
  wallet_id: string;
  authorize_transaction: boolean;
}
