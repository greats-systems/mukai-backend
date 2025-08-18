export interface CreateWalletRequest {
  firstName: string;
  lastName: string;
  mobile: string;
  dateOfBirth: string;
  idNumber: string;
  gender: string; //MALE|FEMALE
  source: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SetPasswordRequest {
  username: string;
  password: string;
  otp: string;
}
