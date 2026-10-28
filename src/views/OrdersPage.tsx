import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Package, ArrowRight, Loader2, ShoppingBag,
  ChevronDown, ChevronUp, RotateCcw, MapPin,
  Calendar, Hash,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ordersApi, getApiError, type Order } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import CTA from '@/sections/CTA';

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { colors: string; label: string; step: number }> = {
  pending:    { colors: 'bg-lemon text-ink border-2 border-ink',   label: 'Pending',    step: 0 },
  paid:       { colors: 'bg-mint text-ink border-2 border-ink',    label: 'Paid',       step: 1 },
  processing: { colors: 'bg-saturn-orange text-white border-2 border-ink', label: 'Processing', step: 2 },
  shipped:    { colors: 'bg-periwinkle text-ink border-2 border-ink', label: 'Shipped',   step: 3 },
  delivered:  { colors: 'bg-mint text-ink border-2 border-ink',    label: 'Delivered',  step: 4 },
  cancelled:  { colors: 'bg-red-400 text-white border-2 border-ink', label: 'Cancelled',  step: -1 },
  refunded:   { colors: 'bg-paper text-ink border-2 border-ink',   label: 'Refunded',   step: -1 },
};

const TIMELINE_STEPS = ['Pending', 'Paid', 'Processing', 'Shipped', 'Delivered'];

// ─── Order Timeline ─────────────────────────────────────────────────────────────
function OrderTimeline({ status }: { status: string }) {
  const currentStep = STATUS_CONFIG[status]?.step ?? 0;
  if (currentStep < 0) return null;

  return (
    <div className="flex items-center mt-4 pt-4 border-t-2 border-ink/20">
      {TIMELINE_STEPS.map((step, i) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-6 h-6 border-2 border-ink flex items-center justify-center font-mono text-[10px] font-black transition-all ${
              i < currentStep ? 'bg-mint text-ink'
              : i === currentStep ? 'bg-saturn-orange text-white shadow-brutal-sm'
              : 'bg-paper text-ink/40'
            }`}>
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span className={`font-mono text-[9px] font-black uppercase tracking-wider whitespace-nowrap ${
              i <= currentStep ? 'text-ink' : 'text-ink/40'
            }`}>{step}</span>
          </div>
          {i < TIMELINE_STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 mb-5 border-b-2 border-ink ${i < currentStep ? 'border-saturn-orange' : 'border-ink/20'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`px-2.5 py-1 font-mono text-[10px] font-black uppercase tracking-wider shadow-brutal-sm ${config.colors}`}>
      {config.label}
    </span>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const fetchOrders = useCallback(async (silent = false) => {
    if (silent) setRefreshing(true);
    try {
      const res = await ordersApi.getMyOrders();
      setOrders(res.data.data!.orders);
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      if (!silent) setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      void fetchOrders();
    }
  }, [fetchOrders, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/orders' }} replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-paper pattern-blueprint flex flex-col items-center justify-center gap-3">
        <div className="card-slab bg-white border-3 border-ink shadow-brutal p-8 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-saturn-orange" />
          <p className="font-mono text-xs font-black uppercase text-ink">Retrieving Order Ledger…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper pattern-blueprint py-12 sm:py-16 text-ink">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b-3 border-ink">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-ink text-paper border-2 border-ink shadow-brutal-sm font-mono text-xs font-black uppercase tracking-wider mb-3">
              <span className="w-2.5 h-2.5 bg-saturn-orange" />
              <span>PRODUCTION TELEMETRY</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-black text-ink uppercase tracking-tight">
              MY ORDERS
            </h1>
            <p className="font-mono text-xs text-ink/70 font-bold mt-1">
              Track manufacturing progress and download tax invoices
            </p>
          </div>

          <button
            onClick={() => void fetchOrders(true)}
            disabled={refreshing}
            className="btn-brutal bg-white hover:bg-lemon text-ink font-mono text-xs font-black uppercase tracking-wider px-4 py-2.5 border-2 border-ink shadow-brutal-sm flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            REFRESH
          </button>
        </div>

        {/* Empty state */}
        {orders.length === 0 ? (
          <div className="card-slab bg-white border-3 border-ink shadow-brutal p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 bg-lemon border-2 border-ink flex items-center justify-center mx-auto shadow-brutal-sm">
              <ShoppingBag className="w-8 h-8 text-ink" />
            </div>
            <h3 className="font-display text-2xl font-black uppercase text-ink">NO ORDERS LOGGED YET</h3>
            <p className="font-mono text-xs text-ink/70 font-bold">
              You haven't commissioned any 3D print runs yet. Upload your CAD mesh or browse standard parts.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => navigate('/custom-lab')}
                className="flex-1 btn-brutal bg-saturn-orange text-white hover:bg-lemon hover:text-ink font-mono text-xs font-black uppercase tracking-wider py-3 border-2 border-ink shadow-brutal cursor-pointer"
              >
                LAUNCH CUSTOM LAB
              </button>
              <button
                onClick={() => navigate('/categories')}
                className="flex-1 btn-brutal bg-white hover:bg-lemon text-ink font-mono text-xs font-black uppercase tracking-wider py-3 border-2 border-ink shadow-brutal cursor-pointer"
              >
                BROWSE HARDWARE
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const isExpanded = expanded === order.id;
              return (
                <div
                  key={order.id}
                  className="card-slab bg-white border-3 border-ink shadow-brutal overflow-hidden"
                >
                  {/* Order header row */}
                  <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-ink/20 bg-paper/50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-black text-ink">
                          ORDER #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="font-mono text-[11px] text-ink/70 font-bold flex flex-wrap items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-saturn-orange" />
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span>•</span>
                        <span>{order.order_items?.length ?? 0} component(s)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:text-right">
                      <div>
                        <span className="font-mono text-[10px] text-ink/60 font-bold uppercase block">Settled Total</span>
                        <span className="font-mono text-xl font-black text-saturn-orange">
                          ₹{order.total_amount.toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => setExpanded(isExpanded ? null : order.id)}
                        className="w-9 h-9 bg-white border-2 border-ink shadow-brutal-sm flex items-center justify-center hover:bg-lemon cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="px-6 pb-6">
                    <OrderTimeline status={order.status} />
                  </div>

                  {/* Expanded Items Drawer */}
                  {isExpanded && (
                    <div className="p-6 bg-paper border-t-3 border-ink space-y-4">
                      <span className="font-mono text-xs font-black uppercase text-saturn-orange block">
                        // COMPONENTS IN PRODUCTION RUN
                      </span>
                      <div className="space-y-2">
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="p-3 bg-white border-2 border-ink flex items-center justify-between font-mono text-xs">
                            <div>
                              <div className="font-black text-ink uppercase">{item.name}</div>
                              <div className="text-[10px] text-ink/70">
                                Qty: {item.quantity} {item.options?.material ? `• Material: ${item.options.material}` : ''}
                              </div>
                            </div>
                            <div className="font-black text-ink">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {order.shipping_address && (
                        <div className="p-3 bg-white border-2 border-ink font-mono text-xs space-y-0.5">
                          <div className="font-black text-saturn-orange uppercase text-[10px] mb-1">
                            // DELIVERY ADDRESS
                          </div>
                          <div>{order.shipping_address.line1}</div>
                          <div>
                            {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postal_code}
                          </div>
                          <div className="font-bold">{order.shipping_address.country}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
      <div className="mt-16">
        <CTA />
      </div>
    </div>
  );
}
