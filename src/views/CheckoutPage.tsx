import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft, CreditCard, Loader2, Lock,
  Package, MapPin, ShoppingBag, CheckCheck,
  Tag, Truck, Check, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ordersApi, couponsApi, getApiError, type ShippingAddress } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';

const schema = z.object({
  line1: z.string().min(5, 'Street address is required (min 5 characters)'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State / Province is required'),
  postal_code: z.string().min(4, 'Valid PIN / Postal code is required'),
  country: z.string().min(2, 'Country is required'),
});
type FormData = z.infer<typeof schema>;

// Step indicator
const steps = [
  { icon: ShoppingBag, label: 'Cart' },
  { icon: MapPin, label: 'Shipping' },
  { icon: CreditCard, label: 'Payment' },
  { icon: CheckCheck, label: 'Complete' },
];

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart, getTotalItems } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    type: 'percent' | 'flat';
    value: number;
    discountAmount: number;
    message: string;
  } | null>(null);

  // Check for invalid IDs on mount
  useEffect(() => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const hasInvalidIds = items.some(item => !uuidRegex.test(item.id));
    
    if (hasInvalidIds) {
      toast.error('Outdated items detected in your cart. Please clear your cart to continue.', {
        duration: 8000,
        action: {
          label: 'Clear Now',
          onClick: () => {
            clearCart();
            toast.success('Cart cleared. Please add currently available products.');
          }
        }
      });
    }
  }, [items, clearCart]);

  const rawSubtotal = getTotalPrice();
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const discountedSubtotal = Math.max(0, rawSubtotal - discountAmount);
  // Free shipping above ₹1,499
  const shippingCost = discountedSubtotal >= 1499 || discountedSubtotal === 0 ? 0 : 149;
  // Standard Indian GST for 3D Printing / Additive Manufacturing (SAC 9988) = 18%
  const gstTax = Math.round(discountedSubtotal * 0.18 * 100) / 100;
  const grandTotal = Math.round((discountedSubtotal + shippingCost + gstTax) * 100) / 100;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      country: 'India',
    }
  });

  // Guard redirects
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/checkout' }} replace />;
  }
  if (items.length === 0) {
    return <Navigate to="/categories" replace />;
  }

  const handleApplyCoupon = async () => {
    const trimmed = couponInput.trim().toUpperCase();
    if (!trimmed) {
      toast.error('Please enter a coupon code');
      return;
    }
    setIsValidatingCoupon(true);
    try {
      const res = await couponsApi.validate(trimmed, rawSubtotal);
      if (res.data.success && res.data.data) {
        setAppliedCoupon(res.data.data);
        toast.success(res.data.data.message || `Coupon ${trimmed} applied successfully!`);
      }
    } catch (err) {
      toast.error(getApiError(err) || 'Invalid or expired coupon code');
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    toast.info('Coupon removed');
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const cartItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        options: item.options,
      }));

      const shippingAddress: ShippingAddress = {
        line1: data.line1,
        city: data.city,
        state: data.state,
        postal_code: data.postal_code,
        country: data.country,
      };

      const res = await ordersApi.createCheckout({
        items: cartItems,
        shippingAddress,
        paymentMethod,
        couponCode: appliedCoupon?.code,
      });

      const responseData = res.data.data;
      if (!responseData) throw new Error('Failed to create order');

      const { orderId, isCod, razorpayOrderId, keyId, amount } = responseData;

      if (isCod || paymentMethod === 'cod') {
        toast.success('Order placed successfully!', {
          description: 'Payment will be collected at your doorstep upon delivery.',
        });
        clearCart();
        navigate(`/order-success?order_id=${orderId}`);
        return;
      }

      // Razorpay Payment Flow
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        toast.error('Razorpay SDK failed to load. Please check your internet connection.');
        setIsLoading(false);
        return;
      }

      const options = {
        key: keyId || 'rzp_test_placeholder',
        amount: amount || Math.round(grandTotal * 100),
        currency: 'INR',
        name: 'Saturn 3D',
        description: 'Precision 3D Printing & Additive Manufacturing',
        order_id: razorpayOrderId,
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },
        notes: {
          orderId: orderId,
        },
        theme: {
          color: '#FF5A1F', // Saturn Orange
        },
        handler: async function (response: any) {
          try {
            await ordersApi.verifyRazorpay({
              orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success('Payment verified successfully!');
            clearCart();
            navigate(`/order-success?order_id=${orderId}`);
          } catch (vErr) {
            toast.error('Payment verification failed. Please contact hello@saturn3d.in with your reference ID.');
            navigate(`/order-success?order_id=${orderId}`);
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
            toast.info('Payment window closed. Your order is reserved under Pending.');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (failRes: any) {
        toast.error(`Payment failed: ${failRes.error?.description || 'Transaction unsuccessful'}`);
        setIsLoading(false);
      });
      rzp.open();

    } catch (err: unknown) {
      const errorRes = (err as Record<string, any>)?.response?.data;
      const errorMessage = getApiError(err);
      
      console.error('Checkout error:', err);

      if (errorRes?.action === 'CLEAR_CART_REQUIRED') {
        toast.error('Cart contains outdated items. Please clear and re-add available models.', {
          action: {
            label: 'Clear Cart',
            onClick: () => clearCart(),
          }
        });
      } else {
        toast.error('Checkout failed', {
          description: errorMessage,
        });
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-studio-light pt-20 sm:pt-24 text-graphite pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 font-mono text-xs font-medium text-muted hover:text-saturn-orange transition-colors group mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to store</span>
        </button>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex items-center w-full max-w-md justify-between">
            {steps.map((step, i) => {
              const active = i === 1 || i === 2;
              const done = i === 0;
              return (
                <div key={step.label} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5 min-w-[50px]">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all border ${
                      done ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                      : active ? 'bg-saturn-orange text-white border-saturn-orange shadow-precision-xs'
                      : 'bg-white text-muted border-black/10'
                    }`}>
                      <step.icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-mono uppercase tracking-wider text-center ${
                      active ? 'text-graphite font-semibold' : done ? 'text-saturn-orange' : 'text-muted'
                    }`}>{step.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 h-[1px] bg-black/10 mx-2 mb-4" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left — Shipping & Payment Selection */}
          <div className="lg:col-span-7 order-2 lg:order-1 space-y-6">
            <div className="card-precision bg-white p-6 sm:p-8 space-y-6">
              <div className="border-b hairline pb-4">
                <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-saturn-orange">// Step 1 of 2</span>
                <h1 className="font-display text-xl sm:text-2xl font-semibold text-graphite tracking-tight mt-1">Shipping Logistics</h1>
                <p className="font-body text-xs text-muted mt-0.5">Dispatch coordinates for domestic express courier across India.</p>
              </div>

              <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-mono text-[11px] font-medium uppercase tracking-wider text-muted">Street Address & Landmark</Label>
                  <Input
                    placeholder="Plot 42, Sector C, Industrial Area"
                    className="h-11 bg-white border hairline font-mono text-xs focus:border-saturn-orange focus:ring-2 focus:ring-saturn-orange/20"
                    {...register('line1')}
                  />
                  {errors.line1 && <p className="font-mono text-xs text-red-500">{errors.line1.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[11px] font-medium uppercase tracking-wider text-muted">City</Label>
                    <Input
                      placeholder="Bhopal"
                      className="h-11 bg-white border hairline font-mono text-xs focus:border-saturn-orange focus:ring-2 focus:ring-saturn-orange/20"
                      {...register('city')}
                    />
                    {errors.city && <p className="font-mono text-xs text-red-500">{errors.city.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[11px] font-medium uppercase tracking-wider text-muted">State / Region</Label>
                    <Input
                      placeholder="Madhya Pradesh"
                      className="h-11 bg-white border hairline font-mono text-xs focus:border-saturn-orange focus:ring-2 focus:ring-saturn-orange/20"
                      {...register('state')}
                    />
                    {errors.state && <p className="font-mono text-xs text-red-500">{errors.state.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[11px] font-medium uppercase tracking-wider text-muted">PIN / Postal Code</Label>
                    <Input
                      placeholder="462023"
                      className="h-11 bg-white border hairline font-mono text-xs focus:border-saturn-orange focus:ring-2 focus:ring-saturn-orange/20"
                      {...register('postal_code')}
                    />
                    {errors.postal_code && <p className="font-mono text-xs text-red-500">{errors.postal_code.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[11px] font-medium uppercase tracking-wider text-muted">Country</Label>
                    <Input
                      placeholder="India"
                      className="h-11 bg-white border hairline font-mono text-xs focus:border-saturn-orange focus:ring-2 focus:ring-saturn-orange/20"
                      {...register('country')}
                    />
                    {errors.country && <p className="font-mono text-xs text-red-500">{errors.country.message}</p>}
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Method Selector */}
            <div className="card-precision bg-white p-6 sm:p-8 space-y-6">
              <div className="border-b hairline pb-4">
                <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-saturn-orange">// Step 2 of 2</span>
                <h2 className="font-display text-xl sm:text-2xl font-semibold text-graphite tracking-tight mt-1">Payment Protocol</h2>
                <p className="font-body text-xs text-muted mt-0.5">Select direct online payment gateway or cash on delivery.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Razorpay Option */}
                <div
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-5 rounded-xl border transition-all cursor-pointer relative ${
                    paymentMethod === 'razorpay'
                      ? 'border-saturn-orange bg-saturn-orange/[0.03] shadow-precision-sm ring-1 ring-saturn-orange/40'
                      : 'border-black/10 hover:border-black/25 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-saturn-orange/10 border border-saturn-orange/20 flex items-center justify-center text-saturn-orange">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-mono font-medium rounded-full border border-emerald-200">
                      Recommended
                    </span>
                  </div>
                  <div className="font-display font-semibold text-sm text-graphite">Razorpay Gateway</div>
                  <div className="font-body text-xs text-muted mt-1 leading-relaxed">
                    UPI (GPay, PhonePe, Paytm), RuPay/Cards, NetBanking
                  </div>
                  {paymentMethod === 'razorpay' && (
                    <div className="absolute top-4 right-4">
                      <Check className="w-4 h-4 text-saturn-orange" />
                    </div>
                  )}
                </div>

                {/* Cash on Delivery Option */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-5 rounded-xl border transition-all cursor-pointer relative ${
                    paymentMethod === 'cod'
                      ? 'border-saturn-orange bg-saturn-orange/[0.03] shadow-precision-sm ring-1 ring-saturn-orange/40'
                      : 'border-black/10 hover:border-black/25 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-black/[0.04] border hairline flex items-center justify-center text-graphite">
                      <Truck className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 bg-studio-light text-muted-dark text-[10px] font-mono font-medium rounded-full border hairline">
                      Doorstep
                    </span>
                  </div>
                  <div className="font-display font-semibold text-sm text-graphite">Cash on Delivery (COD)</div>
                  <div className="font-body text-xs text-muted mt-1 leading-relaxed">
                    Pay in cash or UPI QR upon delivery at your facility
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="absolute top-4 right-4">
                      <Check className="w-4 h-4 text-saturn-orange" />
                    </div>
                  )}
                </div>
              </div>

              {/* Security info */}
              <div className="flex items-start sm:items-center gap-3 p-4 bg-studio-light/60 rounded-xl border hairline">
                <Lock className="w-4 h-4 text-saturn-orange shrink-0 mt-0.5 sm:mt-0" />
                <p className="font-body text-xs text-muted leading-relaxed">
                  256-bit SSL encrypted. Saturn 3D adheres to RBI payment guidelines and never stores card credentials.
                </p>
              </div>

              {/* Action Button */}
              <Button
                type="submit"
                form="checkout-form"
                disabled={isLoading}
                className="w-full h-12 btn-precision-primary text-xs font-mono font-semibold uppercase tracking-wider cursor-pointer disabled:opacity-40"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Order Session…</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Proceed</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right — Order Summary & Coupons */}
          <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-28 space-y-6">
            <div className="card-precision bg-white p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b hairline">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-saturn-orange" />
                  <h2 className="font-display text-base font-semibold text-graphite">Order Summary</h2>
                </div>
                <span className="font-mono text-xs text-muted bg-studio-light px-2.5 py-0.5 rounded-full border hairline">
                  {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex items-center gap-3 p-2.5 rounded-xl border hairline bg-studio-light/40">
                    <div className="w-12 h-12 rounded-lg bg-white border hairline flex-shrink-0 relative overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = '/products/vase.jpg'; }}
                      />
                      <div className="absolute -top-1 -right-1 bg-saturn-orange text-white text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-medium text-xs text-graphite truncate">{item.name}</div>
                      <div className="font-mono text-[10px] text-muted flex items-center gap-1.5 mt-0.5">
                        <span className="text-saturn-orange uppercase">{item.category}</span>
                        {item.options?.material && (
                          <>
                            <span>•</span>
                            <span>{item.options.material}</span>
                          </>
                        )}
                      </div>
                      <div className="font-mono text-[11px] text-graphite mt-0.5">
                        ₹{item.price.toFixed(2)} × {item.quantity}
                      </div>
                    </div>
                    <div className="font-mono font-semibold text-xs text-graphite flex-shrink-0">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Field */}
              <div className="pt-4 border-t hairline">
                <Label className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted mb-2 block">
                  Promotional Coupon
                </Label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-studio-light rounded-xl border hairline">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-saturn-orange" />
                      <div>
                        <div className="font-mono text-xs font-semibold text-graphite">{appliedCoupon.code}</div>
                        <div className="font-mono text-[10px] text-saturn-orange">
                          Discount: -₹{appliedCoupon.discountAmount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="font-mono text-[10px] text-red-600 hover:text-red-700 uppercase tracking-wider px-2 py-1 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. SATURN10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="h-10 font-mono text-xs uppercase bg-white border hairline"
                    />
                    <Button
                      type="button"
                      disabled={isValidatingCoupon || !couponInput.trim()}
                      onClick={handleApplyCoupon}
                      className="h-10 px-4 btn-precision-secondary text-xs font-mono uppercase tracking-wider cursor-pointer"
                    >
                      {isValidatingCoupon ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-2.5 pt-4 border-t hairline font-mono text-xs">
                <div className="flex justify-between items-center text-muted">
                  <span className="uppercase text-[10px]">Subtotal:</span>
                  <span className="font-medium text-graphite">₹{rawSubtotal.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between items-center text-saturn-orange">
                    <span className="uppercase text-[10px] flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Coupon ({appliedCoupon.code}):
                    </span>
                    <span className="font-semibold">-₹{appliedCoupon.discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-muted">
                  <div className="flex flex-col">
                    <span className="uppercase text-[10px]">GST (18% SAC 9988):</span>
                    <span className="text-[9px] text-muted/70">9% CGST + 9% SGST</span>
                  </div>
                  <span className="font-medium text-graphite">₹{gstTax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center text-muted">
                  <span className="uppercase text-[10px]">Shipping:</span>
                  <span className={`font-semibold ${shippingCost === 0 ? 'text-saturn-orange' : 'text-graphite'}`}>
                    {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                {/* Grand Total Slab */}
                <div className="p-4 bg-studio-light rounded-xl border hairline mt-3">
                  <div className="flex justify-between items-baseline">
                    <span className="font-mono text-xs uppercase text-muted">Grand Total:</span>
                    <span className="font-display text-2xl font-semibold text-saturn-orange">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 border-t hairline grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 bg-studio-light/60 rounded-lg border hairline">
                  <div className="font-mono font-medium text-[10px] text-graphite uppercase">Bhopal Hub</div>
                  <div className="font-body text-[10px] text-muted">Direct Factory Dispatch</div>
                </div>
                <div className="p-2.5 bg-studio-light/60 rounded-lg border hairline">
                  <div className="font-mono font-medium text-[10px] text-graphite uppercase">Official GST</div>
                  <div className="font-body text-[10px] text-muted">Tax Invoice Included</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
