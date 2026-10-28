import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Loader2, Printer, Truck, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ordersApi, type Order } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';

// Steps shown in the "What's Next?" section
const nextSteps = [
  { icon: Package, title: 'Order Confirmed', desc: 'Your precision batch order is queued in our production farm.' },
  { icon: Printer, title: 'CoreXY 3D Printing', desc: 'Laser calibration and print starts within 24 hours.' },
  { icon: Truck, title: 'Dispatched via Express Air', desc: 'Ships across India with real-time tracking.' },
  { icon: Mail, title: 'Tax Invoice & Telemetry', desc: 'GST invoice and QA report dispatched to your email.' },
];

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const sessionId = searchParams.get('session_id');
  const orderId = searchParams.get('order_id');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { clearCart } = useCartStore();
  const isSimulated = searchParams.get('simulated') === 'true';

  useEffect(() => {
    clearCart();

    const fetch = async () => {
      setLoading(true);
      try {
        if (sessionId) {
          const res = await ordersApi.verifyStripeSession(sessionId);
          setOrder(res.data.data!.order);
        } else if (orderId) {
          const res = await ordersApi.getById(orderId);
          setOrder(res.data.data!.order);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [sessionId, orderId, clearCart]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-paper pattern-blueprint gap-4">
        <div className="card-slab bg-white border-3 border-ink shadow-brutal p-8 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-saturn-orange" />
          <p className="font-mono text-xs font-black uppercase text-ink">Confirming Order Telemetry…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper pattern-blueprint flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full space-y-6">

        {/* Success Icon Slab */}
        <div className="card-slab bg-lemon border-4 border-ink shadow-brutal-xl p-8 text-center space-y-4">
          <div className="w-20 h-20 bg-mint border-3 border-ink flex items-center justify-center mx-auto shadow-brutal">
            <CheckCircle className="w-10 h-10 text-ink" />
          </div>
          
          <div>
            <div className="inline-block px-3 py-0.5 bg-ink text-paper font-mono text-[10px] font-black uppercase tracking-wider mb-2">
              PAYMENT VERIFIED ● PRODUCTION QUEUED
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-black text-ink uppercase tracking-tight">
              ORDER CONFIRMED!
            </h1>
            <p className="font-mono text-xs text-ink/80 font-bold mt-2">
              {error
                ? "Payment received! Your order is queued. Check your email for tracking info."
                : "Thank you for manufacturing with Saturn 3D. Precision slicing has commenced!"}
            </p>
          </div>
        </div>

        {/* Order details card */}
        {order ? (
          <div className="card-slab bg-white border-3 border-ink shadow-brutal p-6 space-y-3 font-mono text-xs">
            {isSimulated && (
              <div className="flex justify-center mb-1">
                <span className="px-3 py-1 bg-lemon text-ink font-black uppercase text-[10px] border border-ink">
                  Simulation Order
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pb-2 border-b border-ink/20">
              <span className="font-bold text-ink/70 uppercase">Order ID:</span>
              <span className="font-black text-ink bg-paper px-2 py-0.5 border border-ink">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-ink/20">
              <span className="font-bold text-ink/70 uppercase">Status:</span>
              <span className="px-2 py-0.5 bg-mint text-ink font-black uppercase text-[10px] border border-ink shadow-brutal-sm">
                {order.status}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-ink/20">
              <span className="font-bold text-ink/70 uppercase">Total Settled:</span>
              <span className="font-black text-saturn-orange text-lg">₹{order.total_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-ink/70 uppercase">Components:</span>
              <span className="font-black text-ink">{order.order_items?.length ?? 0} item(s)</span>
            </div>
          </div>
        ) : !error && (
          <div className="card-slab bg-lemon border-3 border-ink shadow-brutal p-4 text-center font-mono text-xs font-bold">
            Payment successful! Order telemetry updating in background.
          </div>
        )}

        {/* What's Next timeline */}
        <div className="card-slab bg-ink text-paper border-4 border-ink shadow-brutal p-6">
          <div className="flex items-center gap-3 mb-5 border-b border-paper/20 pb-3">
            <Package className="w-5 h-5 text-saturn-orange" />
            <span className="font-display font-black text-sm uppercase tracking-wider text-paper">PRODUCTION TIMELINE</span>
          </div>
          <div className="space-y-4">
            {nextSteps.map((step, i) => (
              <div key={step.title} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-paper text-ink border-2 border-paper flex items-center justify-center flex-shrink-0 font-mono font-black text-xs shadow-brutal-sm">
                  {i + 1}
                </div>
                <div className="pb-1 font-mono">
                  <div className="text-xs font-black text-paper uppercase">{step.title}</div>
                  <div className="text-[10px] text-paper/70 font-medium">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => navigate('/orders')}
            className="flex-1 h-12 btn-brutal bg-saturn-orange text-white hover:bg-lemon hover:text-ink font-mono font-black uppercase tracking-wider text-xs border-2 border-ink shadow-brutal cursor-pointer"
          >
            VIEW MY ORDERS
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/categories')}
            className="flex-1 h-12 btn-brutal bg-white hover:bg-lemon text-ink font-mono font-black uppercase tracking-wider text-xs border-2 border-ink shadow-brutal cursor-pointer"
          >
            CONTINUE SHOPPING
          </Button>
        </div>
      </div>
    </div>
  );
}
