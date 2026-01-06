export class ExpressPaymentSmilePayResponse {
  responseMessage: string;
  responseCode: string;
  status: string;
  transactionReference: string;
}

export class StandardCheckoutResponse {
  responseMessage: string;
  responseCode: string;
  paymentUrl: string;
  transactionReference: string;
}
