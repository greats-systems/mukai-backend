export class User {
  id: number;
  name: string;
  username: string;
  email: string;
  age: number;
  password: string;
  gender: string;
}

export class MukaiProfile {
  id?: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  account_type: string;
  dob: string;
  gender: string;
  wallet_id: string;
  cooperative_id: string;
  business_id: string;
  affiliations: string;
  coop_account_id: string;
  push_token: string;
  avatar: string;
  national_id_url: string;
  passport_url: string;
  is_invited: boolean;
}
