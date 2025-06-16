export class Loan {
  id: string;
  created_at: string;
  borrower_wallet_id: string;
  lender_wallet_id: string;
  principal_amount: number;
  interest_rate: number;
  loan_term_days: number;
  due_date: Date;
  status: string;
  remaining_balance: number;
  last_payment_date: Date;
  next_payment_date: Date;
  payment_amount: number;
  loan_purpose: string;
  collateral_description: string;
}
