/**
 * Payment Provider Interface
 * Supports Razorpay (India), Cash on Delivery (COD), and extensible gateways.
 */

export interface CreatePaymentParams {
  orderId: string;
  orderNumber: string;
  amount: number; // in INR
  currency?: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  notes?: Record<string, string>;
}

export interface PaymentSessionResult {
  provider: 'razorpay' | 'cod';
  paymentSessionId?: string;
  amount: number;
  currency: string;
  keyId?: string;
  providerData?: Record<string, any>;
  isCod?: boolean;
}

export interface PaymentVerificationParams {
  orderId: string;
  paymentId?: string;
  signature?: string;
  razorpayOrderId?: string;
  providerData?: any;
}

export interface PaymentVerificationResult {
  success: boolean;
  transactionId?: string;
  status: 'paid' | 'pending' | 'failed';
  error?: string;
}

export interface RefundResult {
  success: boolean;
  refundId?: string;
  amount?: number;
  error?: string;
}

export interface IPaymentProvider {
  name: 'razorpay' | 'cod';
  createPaymentSession(params: CreatePaymentParams): Promise<PaymentSessionResult>;
  verifyPayment(params: PaymentVerificationParams): Promise<PaymentVerificationResult>;
  processRefund(paymentId: string, amount?: number): Promise<RefundResult>;
}
