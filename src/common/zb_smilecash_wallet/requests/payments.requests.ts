import { PaymentMethod } from "../common/payments.methods";


export interface PaymentInitiateRequest {
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: PaymentMethod;
  reference: string;
  callbackUrl: string;
}

export interface PaymentConfirmRequest {
  paymentId: string;
  otp?: string;
}
