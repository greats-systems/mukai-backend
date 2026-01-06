export class User {
  id: number;
  name: string;
  username: string;
  email: string;
  age: number;
  password: string;
  gender: string;
}

export class Profile {
  id?: string;
  auth_user_id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  d_o_b: string;
  self_description: string;
  profile_image_url: string;
  is_verified: boolean;
  street_address: string;
  neighbourhood: string;
  city: string;
  country: string;
  province: string;
  account_status: string;
  wallet_address: string;
  online_status: boolean;
  abilities: string;
  department: string;
  role: string;
  account_type: string;
  specialization: string;
  trading_as: string | null;
  is_subscribed: boolean;
  is_premium_subscribed: boolean;
  community_role: string;
  national_id: string;
  marital_status: string;
  country_of_birth: string;
  avatar: string;
  wallet_balance: number;
  wallet_id: string;
  // Add other nullable fields with proper types
  profile_image?: string;
  ward?: string;
  maiden_surname?: string;
  national_id_url?: string;
  passport_url?: string;
  province_state?: string;
  push_token?: string;
  tenant_id?: string;
  main_business_uid?: string;
  status?: string;
}
