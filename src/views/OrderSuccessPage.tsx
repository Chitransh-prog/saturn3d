import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Loader2, Printer, Truck, Mail } from 'lucide-react';
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-studio-light gap-4">
        <div className="card-precision bg-white p-8 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-saturn-orange" />
          <p className="font-mono text-xs font-medium text-muted uppercase">Confirming Order Telemetry…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-studio-light flex items-center justify-center px-4 py-20 text-graphite">
      <div className="max-w-lg w-full space-y-6">

        {/* Success Icon Slab */}
        <div className="card-precision bg-white p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-600">
            <CheckCircle className="w-8 h-8" />
          </div>
          
          <div>
            <div className="inline-block px-3 py-1 bg-black/[0.04] text-muted-dark border hairline rounded-full font-mono text-[10px] font-medium uppercase tracking-wider mb-2">
              Payment Verified • Production Queued
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-graphite tracking-tight">
              Order Confirmed
            </h1>
            <p className="font-body text-xs sm:text-sm text-muted mt-2 max-w-sm mx-auto leading-relaxed">
              {error
                ? "Payment received. Your order is queued. Check your email for tracking info."
                : "Thank you for manufacturing with Saturn 3D. Precision slicing has commenced."}
            </p>
          </div>
        </div>

        {/* Order details card */}
        {order ? (
          <div className="card-precision bg-white p-6 space-y-3 font-mono text-xs">
            {isSimulated && (
              <div className="flex justify-center mb-1">
                <span className="px-2.5 py-0.5 bg-studio-light text-muted-dark font-medium uppercase text-[10px] border hairline rounded-full">
                  Simulation Order
                </span>
              </div>
            )}
            <div className="flex justify-between items-center pb-2 border-b hairline">
              <span className="text-muted uppercase text-[11px]">Order ID</span>
              <span className="font-semibold text-graphite bg-studio-light px-2 py-0.5 rounded border hairline">
                #{order.id.slice(0, 8).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b hairline">
              <span className="text-muted uppercase text-[11px]">Status</span>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-medium uppercase text-[10px] rounded-full border border-emerald-200">
                {order.status}
              </span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b hairline">
              <span className="text-muted uppercase text-[11px]">Total Settled</span>
              <span className="font-display font-semibold text-saturn-orange text-base">₹{order.total_amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted uppercase text-[11px]">Components</span>
              <span className="font-medium text-graphite">{order.order_items?.length ?? 0} item(s)</span>
            </div>
          </div>
        ) : !error && (
          <div className="card-precision bg-white p-4 text-center font-mono text-xs text-muted">
            Payment successful. Order telemetry updating in background.
          </div>
        )}

        {/* What's Next timeline */}
        <div className="card-precision-dark bg-graphite text-studio-light p-6">
          <div className="flex items-center gap-2.5 mb-5 border-b hairline-dark pb-3">
            <Package className="w-4 h-4 text-saturn-orange" />
            <span className="font-display font-semibold text-sm uppercase tracking-wider text-white">Production Timeline</span>
          </div>
          <div className="space-y-4">
            {nextSteps.map((step, i) => (
              <div key={step.title} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-white/10 text-white border hairline-dark flex items-center justify-center shrink-0 font-mono text-xs">
                  {i + 1}
                </div>
                <div>
                  <div className="font-display font-medium text-xs text-white">{step.title}</div>
                  <div className="font-body text-[11px] text-muted-dark leading-relaxed">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/orders')}
            className="flex-1 h-11 btn-precision-primary text-xs font-mono font-medium uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View My Orders</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/categories')}
            className="flex-1 h-11 btn-precision-secondary text-xs font-mono font-medium uppercase tracking-wider flex items-center justify-center cursor-pointer"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
