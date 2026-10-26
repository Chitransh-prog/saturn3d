import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft, CreditCard, Loader2, Shield, Lock,
  Package, MapPin, ShoppingBag, CheckCheck,
  Tag, Percent, Truck, Check, Sparkles, AlertCircle
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

  // Check for invalid IDs (legacy mock data) on mount
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
  // Free shipping above ₹1,499 ($20 equivalent)
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
    return <Navigate to="/products" replace />;
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
          color: '#F7931E', // Saturn Orange
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
    <div className="min-h-screen bg-[#FAFAFA] pt-20 sm:pt-24 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-black transition-colors text-[10px] sm:text-xs font-black uppercase tracking-widest group mb-6 sm:mb-10"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Store
        </button>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8 sm:mb-14">
          <div className="flex items-center w-full max-w-md justify-between sm:justify-center">
            {steps.map((step, i) => {
              const active = i === 1 || i === 2;
              const done = i === 0;
              return (
                <div key={step.label} className="flex items-center flex-1 last:flex-none sm:flex-none">
                  <div className="flex flex-col items-center gap-1.5 min-w-[50px] sm:min-w-[64px]">
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                      done ? 'bg-emerald-500 text-white'
                      : active ? 'bg-black text-white shadow-lg shadow-black/10'
                      : 'bg-white border border-slate-200 text-slate-400'
                    }`}>
                      <step.icon className="w-4 h-4" />
                    </div>
                    <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-center mt-1 sm:mt-0 ${
                      active ? 'text-black' : done ? 'text-emerald-500' : 'text-slate-400'
                    }`}>{step.label}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`flex-1 sm:w-12 h-px mb-5 ${i < 1 ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* Left — Shipping & Payment Selection (Order 2 on mobile, 1 on desktop) */}
          <div className="lg:col-span-7 order-2 lg:order-1 space-y-8">
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 sm:p-10 shadow-sm">
              <div className="mb-8">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F7931E]">Step 1 of 2</span>
                <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-1">Shipping Details</h1>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">Enter your precise delivery coordinates in India</p>
              </div>

              <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Street Address & Landmark</Label>
                  <Input
                    placeholder="Plot 42, Sector C, Industrial Area"
                    className="h-12 rounded-xl border-slate-200 focus:border-black font-medium text-sm shadow-sm px-4"
                    {...register('line1')}
                  />
                  {errors.line1 && <p className="text-xs text-rose-500 font-bold ml-1">{errors.line1.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">City</Label>
                    <Input
                      placeholder="Bhopal"
                      className="h-12 rounded-xl border-slate-200 focus:border-black font-medium text-sm shadow-sm px-4"
                      {...register('city')}
                    />
                    {errors.city && <p className="text-xs text-rose-500 font-bold ml-1">{errors.city.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">State / Region</Label>
                    <Input
                      placeholder="Madhya Pradesh"
                      className="h-12 rounded-xl border-slate-200 focus:border-black font-medium text-sm shadow-sm px-4"
                      {...register('state')}
                    />
                    {errors.state && <p className="text-xs text-rose-500 font-bold ml-1">{errors.state.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">PIN / Postal Code</Label>
                    <Input
                      placeholder="462023"
                      className="h-12 rounded-xl border-slate-200 focus:border-black font-medium text-sm shadow-sm px-4"
                      {...register('postal_code')}
                    />
                    {errors.postal_code && <p className="text-xs text-rose-500 font-bold ml-1">{errors.postal_code.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Country</Label>
                    <Input
                      placeholder="India"
                      className="h-12 rounded-xl border-slate-200 focus:border-black font-medium text-sm shadow-sm px-4"
                      {...register('country')}
                    />
                    {errors.country && <p className="text-xs text-rose-500 font-bold ml-1">{errors.country.message}</p>}
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 sm:p-10 shadow-sm space-y-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F7931E]">Step 2 of 2</span>
                <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-1">Payment Method</h2>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">Select your preferred payment channel</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Razorpay Option */}
                <div
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    paymentMethod === 'razorpay'
                      ? 'border-black bg-slate-50/50 shadow-md'
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#F7931E]">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase tracking-widest border border-emerald-100">
                      Recommended
                    </span>
                  </div>
                  <div className="font-black text-sm text-black">Razorpay (India)</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-1">
                    UPI (Google Pay, PhonePe, Paytm), RuPay/Visa/Mastercard, NetBanking & Wallets
                  </div>
                  {paymentMethod === 'razorpay' && (
                    <div className="absolute top-4 right-4 text-black">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Cash on Delivery Option */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                    paymentMethod === 'cod'
                      ? 'border-black bg-slate-50/50 shadow-md'
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-black/10 flex items-center justify-center text-black">
                      <Truck className="w-5 h-5" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[8px] font-black uppercase tracking-widest border border-slate-200">
                      Doorstep
                    </span>
                  </div>
                  <div className="font-black text-sm text-black">Cash on Delivery (COD)</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-1">
                    Pay in cash or UPI QR upon delivery at your facility
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="absolute top-4 right-4 text-black">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>

              {/* Security info */}
              <div className="flex items-start sm:items-center gap-4 p-4 rounded-xl bg-[#F2F2F2] border border-slate-200">
                <Lock className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5 sm:mt-0" />
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                  All transactions are 256-bit SSL encrypted. Saturn 3D adheres to RBI payment guidelines and never stores your raw card/banking credentials.
                </p>
              </div>

              {/* Action Button */}
              <Button
                type="submit"
                form="checkout-form"
                disabled={isLoading}
                className="w-full h-14 bg-black hover:bg-[#F7931E] text-white font-black uppercase tracking-widest text-xs rounded-full transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-black/10 hover:shadow-orange-500/20 group"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing Order Session…
                  </>
                ) : (
                  <>
                    <span>Confirm & Proceed</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white group-hover:scale-125 transition-transform" />
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right — Order Summary & Coupons (Order 1 on mobile, 2 on desktop) */}
          <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-28 space-y-6">
            <div className="bg-white rounded-[2rem] border border-slate-100 p-6 sm:p-8 shadow-sm">
              <div className="flex items-baseline gap-3 mb-6">
                <Package className="w-4 h-4 text-[#F7931E]" />
                <h2 className="text-xl font-black text-black tracking-tight">Order Summary</h2>
                <span className="ml-auto text-[10px] font-black text-slate-400 py-1 px-3 bg-slate-100 rounded-full">
                  {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3 mb-6 max-h-[35vh] overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.cartItemId} className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = `https://picsum.photos/seed/${item.id}/200/200`; }}
                      />
                      <div className="absolute top-1 right-1 bg-black text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-xs text-black truncate">{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                        <span className="text-[#F7931E] uppercase text-[9px] font-black">{item.category}</span>
                        {item.options?.material && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span>{item.options.material}</span>
                          </>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 font-bold mt-1">
                        ₹{item.price.toFixed(2)} × {item.quantity}
                      </div>
                    </div>
                    <div className="font-black text-xs text-black flex-shrink-0">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Field */}
              <div className="pt-4 border-t border-slate-100 mb-6">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">
                  Promotional Coupon
                </Label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50/70 border border-orange-200">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#F7931E]" />
                      <div>
                        <div className="text-xs font-black text-black tracking-wider uppercase">{appliedCoupon.code}</div>
                        <div className="text-[10px] font-bold text-[#F7931E]">
                          Discount: -₹{appliedCoupon.discountAmount.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[10px] font-black text-rose-500 hover:text-rose-700 uppercase tracking-widest px-2 py-1"
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
                      className="h-10 text-xs font-bold uppercase rounded-xl border-slate-200"
                    />
                    <Button
                      type="button"
                      disabled={isValidatingCoupon || !couponInput.trim()}
                      onClick={handleApplyCoupon}
                      variant="outline"
                      className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-slate-200 hover:bg-black hover:text-white"
                    >
                      {isValidatingCoupon ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Subtotal</span>
                  <span className="font-bold text-black">₹{rawSubtotal.toFixed(2)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between items-center text-emerald-600">
                    <span className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Coupon ({appliedCoupon.code})
                    </span>
                    <span className="font-black">-₹{appliedCoupon.discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">GST (18% SAC 9988)</span>
                    <span className="text-[9px] text-slate-300 font-medium">9% CGST + 9% SGST</span>
                  </div>
                  <span className="font-bold text-black">₹{gstTax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Shipping</span>
                  <span className={`font-black ${shippingCost === 0 ? 'text-emerald-600' : 'text-black'}`}>
                    {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between items-baseline pt-4 mt-2 border-t border-slate-100">
                  <span className="font-black text-black uppercase tracking-widest text-xs">Total Amount</span>
                  <span className="font-black text-3xl text-[#F7931E] tracking-tight">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-black text-[10px] text-black uppercase tracking-tight">Bhopal Hub</div>
                  <div className="text-[9px] text-slate-400">Direct Factory Dispatch</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="font-black text-[10px] text-black uppercase tracking-tight">Official GST</div>
                  <div className="text-[9px] text-slate-400">Tax Invoice Supplied</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
