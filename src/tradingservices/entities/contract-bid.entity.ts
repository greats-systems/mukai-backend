export class ContractBid {
  bid_id: string;
  contract_id: string;
  provider_id?: string;
  opening_date: string;
  status: string;
  closing_date?: string;
  award_date?: string;
  awarded_to?: string;
}
