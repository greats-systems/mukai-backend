import { PaymentStatus } from '../common/payments.status';

export interface PaymentResponse {
  success: boolean;
  paymentId: string;
  status: PaymentStatus;
  message: string;
  data?: any;
}
