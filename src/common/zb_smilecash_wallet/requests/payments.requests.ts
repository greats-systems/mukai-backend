import { PaymentMethod } from '../common/payments.methods';

export class PaymentInitiateRequest {
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: PaymentMethod;
  reference: string;
  callbackUrl: string;
}

export class PaymentConfirmRequest {
  paymentId: string;
  otp?: string;
}
