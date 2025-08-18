class BaseTransactionData {
  id: string;
  reference: string;
  currency: string;
  product: string;
  transactorId: string;
  transactorName: string;
  source: string;
  destination: string;
  transactionDate: string;
  channel: string;
  description: string;
  typeOfTransaction: string;
  additionalData: null;
}

export class TransactionResponseAuth {
  responseCode: string;
  responseDescription: string;
  data: {
    amount: number;
    transactionStatus: 'PENDING';
    authResponse: {
      description: string;
      transactionId: string;
      status: null;
      recipientName: null;
    };
    billerResponse: null;
    transactionStateDescription: null;
  } & BaseTransactionData;
}

export class TransactionResponsePayment {
  responseCode: string;
  responseDescription: string;
  data: {
    amount: number;
    transactionStatus: 'COMPLETED';
    authResponse: null;
    billerResponse: {
      balance: number;
    };
    transactionStateDescription: string;
  } & BaseTransactionData;
}

export class InsufficientFundsResponse {
  responseCode: string;
  responseDescription: 'Insufficient Funds';
  data: null;
}

export class CheckingAccountNotFoundResponse {
  responseCode: string;
  responseDescription: 'Checking account not found';
  data: {
    message: string;
  };
}
