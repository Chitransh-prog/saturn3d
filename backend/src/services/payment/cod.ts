import {
  IPaymentProvider,
  CreatePaymentParams,
  PaymentSessionResult,
  PaymentVerificationParams,
  PaymentVerificationResult,
  RefundResult,
} from './types.js';

export class CODProvider implements IPaymentProvider {
  name: 'cod' = 'cod';

  async createPaymentSession(params: CreatePaymentParams): Promise<PaymentSessionResult> {
    return {
      provider: 'cod',
      paymentSessionId: `cod_${params.orderId}`,
      amount: params.amount,
      currency: params.currency || 'INR',
      isCod: true,
      providerData: {
        method: 'cash_on_delivery',
        note: 'Payment to be collected upon doorstep delivery',
      },
    };
  }

  async verifyPayment(params: PaymentVerificationParams): Promise<PaymentVerificationResult> {
    return {
      success: true,
      transactionId: `cod_pending_${params.orderId}`,
      status: 'pending', // COD is pending until delivered
    };
  }

  async processRefund(_paymentId: string, amount?: number): Promise<RefundResult> {
    return {
      success: true,
      refundId: `cod_reversal_${Date.now()}`,
      amount,
    };
  }
}
