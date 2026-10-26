import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Loader2, Printer, Truck, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ordersApi, type Order } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';

// Steps shown in the "What's Next?" section
const nextSteps = [
  { icon: Package, title: 'Order Confirmed', desc: 'Your order is being processed in our system.' },
  { icon: Printer, title: '3D Printing', desc: 'We will start printing your items within 24 hours.' },
  { icon: Truck, title: 'Dispatched', desc: 'Estimated dispatch: 24–48 hours after printing.' },
  { icon: Mail, title: 'Tracking Info', desc: 'A shipping confirmation email will be sent to you.' },
];

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Stripe can redirect with ?session_id=... OR the backend can redirect with ?order_id=...
  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { clearCart } = useCartStore();
  const isSimulated = searchParams.get('simulated') === 'true';

  useEffect(() => {
    // Basic safety: Clear cart on success page entry
    clearCart();

    const fetch = async () => {
      setLoading(true);
      try {
        if (sessionId) {
          // Came straight from Stripe — verify the session to get the order
          const res = await ordersApi.verifyStripeSession(sessionId);
          setOrder(res.data.data!.order);
        } else if (orderId) {
          const res = await ordersApi.getById(orderId);
          setOrder(res.data.data!.order);
        }
      } catch {
        // Order might still be pending webhook update — not a hard error
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [sessionId, orderId, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-slate-400">Confirming your order…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
      <div className="max-w-lg w-full">

        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-emerald-500" />
            </div>
            {/* pulse ring */}
            <div className="absolute inset-0 rounded-full border-2 border-emerald-300 animate-ping opacity-30" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl font-black text-black tracking-tighter mb-3">
            Order Confirmed!
          </h1>
          <p className="text-slate-400 font-medium">
            {error
              ? "Payment received! Your order is being created. Check your email for confirmation."
              : "Thank you for your purchase. We'll start printing your order right away!"}
          </p>
        </div>

        {/* Order details card */}
        {order ? (
          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-6 mb-6 space-y-4">
            {isSimulated && (
              <div className="flex justify-center mb-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-amber-200">
                  Simulation Order
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Order ID</span>
              <span className="font-black text-xs text-black bg-white px-3 py-1 rounded-lg border border-slate-200">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Status</span>
              <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200">
                {order.status}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total Paid</span>
              <span className="font-black text-primary text-lg">${order.total_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Items</span>
              <span className="font-black text-xs text-black">{order.order_items?.length ?? 0} item(s)</span>
            </div>
          </div>
        ) : !error && (
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 mb-6 text-center">
            <p className="text-xs font-bold text-amber-700">
              Payment successful! Order details will appear shortly.
            </p>
          </div>
        )}

        {/* Ordered Items */}
        {order?.order_items && order.order_items.length > 0 && (
          <div className="mb-6 space-y-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Items Ordered</h3>
            {order.order_items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-black text-xs text-black truncate">{item.name}</div>
                  <div className="text-[10px] text-slate-400 font-medium">Qty: {item.quantity}</div>
                </div>
                <div className="font-black text-xs text-primary">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}

        {/* What's Next timeline */}
        <div className="rounded-2xl bg-black p-6 mb-6">
          <div className="flex items-center gap-3 mb-5">
            <Package className="w-5 h-5 text-primary" />
            <span className="font-black text-white text-sm uppercase tracking-widest">What's Next?</span>
          </div>
          <div className="space-y-4">
            {nextSteps.map((step, i) => (
              <div key={step.title} className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <step.icon className="w-3.5 h-3.5 text-primary" />
                  </div>
                  {i < nextSteps.length - 1 && (
                    <div className="w-px h-4 bg-white/10" />
                  )}
                </div>
                <div className="pb-1">
                  <div className="text-xs font-black text-white">{step.title}</div>
                  <div className="text-[10px] font-medium text-white/50">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => navigate('/orders')}
            className="flex-1 h-12 bg-black hover:bg-primary text-white font-black uppercase tracking-widest text-xs rounded-xl"
          >
            View My Orders
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/products')}
            className="flex-1 h-12 border-slate-200 font-black uppercase tracking-widest text-xs rounded-xl hover:border-black hover:text-black"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
