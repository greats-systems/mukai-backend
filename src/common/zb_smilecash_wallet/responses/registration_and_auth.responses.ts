export class LoginResponse {
  username: string;
  mobile: string;
  userType: string;
  token: string;
  roles: string[];
  authorities: string[];
  userId: string;
  parentAccountId: string;
  transactorType: string;
  additionalInformation: string;
  corporate: boolean;
}

export class SetPasswordResponse {
  response: string;
}
