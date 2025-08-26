export interface ExpressPaymentSmilePayRequestAuth {
  orderReference: string;
  amount: number;
  returnUrl: string;
  resultUrl: string;
  itemName: string;
  itemDescription: string;
  currencyCode: string;
  firstName: string;
  lastName: string;
  mobilePhoneNumber: string;
  email: string;
  cancelUrl: string;
  failureUrl: string;
  zbWalletMobile: string;
}

export interface ExpressPaymentSmilePayRequestConfirm {
  otp: string;
  transactionReference: string;
}
