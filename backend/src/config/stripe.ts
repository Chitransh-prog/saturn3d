import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
const isPlaceholder = !process.env.STRIPE_SECRET_KEY || 
                      stripeKey.includes('USER_REQUIRED') || 
                      stripeKey === 'sk_test_placeholder';

if (isPlaceholder) {
  console.warn('[Stripe] Using placeholder key. Payments will be simulated.');
}

const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-02-24.acacia',
});

export default stripe;
