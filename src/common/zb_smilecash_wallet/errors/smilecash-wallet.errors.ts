export class CreateWalletError {
  message: string;
  status: string;
  timestamp: string;
}

export class LoginError {
  message: string;
  status: string;
  timestamp: string;
}

export class PaymentError {
  message: string;
  status: string;
  timestamp: string;
}

export class TransactionError {
  responseCode: string;
  responseDescription: string;
  data: {
    message: string;
  };
}
