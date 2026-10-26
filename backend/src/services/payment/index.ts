import { IPaymentProvider } from './types.js';
import { RazorpayProvider } from './razorpay.js';
import { CODProvider } from './cod.js';

export * from './types.js';
export * from './razorpay.js';
export * from './cod.js';

const razorpayInstance = new RazorpayProvider();
const codInstance = new CODProvider();

export function getPaymentProvider(method: 'razorpay' | 'cod' = 'razorpay'): IPaymentProvider {
  switch (method.toLowerCase()) {
    case 'cod':
      return codInstance;
    case 'razorpay':
    default:
      return razorpayInstance;
  }
}
