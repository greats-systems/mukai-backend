class Payment {
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
}

export class EcoCash extends Payment {
  email: string;
  cancelUrl: string;
  failureUrl: string;
  ecocashMobile: string;
}

export class InnBucks extends Payment {}

export class OMari extends Payment {}

export class 
