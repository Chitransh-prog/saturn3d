import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Package, Loader2, ShoppingBag,
  ChevronDown, ChevronUp, RotateCcw,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { ordersApi, getApiError, type Order } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import CTA from '@/sections/CTA';

// Status config
const STATUS_CONFIG: Record<string, { colors: string; label: string; step: number }> = {
  pending:    { colors: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Pending', step: 0 },
  paid:       { colors: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Paid', step: 1 },
  processing: { colors: 'bg-saturn-orange/10 text-saturn-orange border-saturn-orange/30', label: 'Processing', step: 2 },
  shipped:    { colors: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Shipped', step: 3 },
  delivered:  { colors: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Delivered', step: 4 },
  cancelled:  { colors: 'bg-red-50 text-red-700 border-red-200', label: 'Cancelled', step: -1 },
  refunded:   { colors: 'bg-black/5 text-muted-dark border-black/10', label: 'Refunded', step: -1 },
};

const TIMELINE_STEPS = ['Pending', 'Paid', 'Processing', 'Shipped', 'Delivered'];

function OrderTimeline({ status }: { status: string }) {
  const currentStep = STATUS_CONFIG[status]?.step ?? 0;
  if (currentStep < 0) return null;

  return (
    <div className="flex items-center mt-4 pt-4 border-t hairline">
      {TIMELINE_STEPS.map((step, i) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-[10px] font-medium transition-all ${
              i < currentStep ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : i === currentStep ? 'bg-saturn-orange text-white border-saturn-orange shadow-precision-xs'
              : 'bg-studio-light text-muted border-black/10'
            }`}>
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span className={`font-mono text-[10px] uppercase tracking-wider whitespace-nowrap ${
              i <= currentStep ? 'text-graphite font-medium' : 'text-muted'
            }`}>{step}</span>
          </div>
          {i < TIMELINE_STEPS.length - 1 && (
            <div className={`flex-1 h-[1px] mx-2 mb-5 ${i < currentStep ? 'bg-saturn-orange' : 'bg-black/10'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide rounded-full border ${config.colors}`}>
      {config.label}
    </span>
  );
}

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
      <div className="min-h-screen bg-studio-light flex flex-col items-center justify-center gap-3">
        <div className="card-precision bg-white p-8 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-saturn-orange" />
          <p className="font-mono text-xs font-medium uppercase text-muted">Retrieving Order Ledger…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-studio-light py-20 sm:py-24 text-graphite">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b hairline">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/[0.04] text-muted-dark border hairline rounded-full font-mono text-[11px] font-medium uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-saturn-orange" />
              <span>Production Telemetry</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-graphite tracking-tight">
              My Orders
            </h1>
            <p className="font-body text-xs sm:text-sm text-muted mt-1">
              Track manufacturing progress and download tax invoices
            </p>
          </div>

          <button
            onClick={() => void fetchOrders(true)}
            disabled={refreshing}
            className="btn-precision-secondary text-xs font-mono font-medium uppercase tracking-wider px-4 py-2.5 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Empty state */}
        {orders.length === 0 ? (
          <div className="card-precision bg-white p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-14 h-14 rounded-full bg-studio-light border hairline flex items-center justify-center mx-auto text-muted">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl font-semibold text-graphite">No Orders Logged Yet</h3>
            <p className="font-body text-xs sm:text-sm text-muted max-w-sm mx-auto leading-relaxed">
              You haven't commissioned any 3D print runs yet. Upload your CAD mesh or browse standard parts.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => navigate('/custom-lab')}
                className="flex-1 btn-precision-primary py-2.5 text-xs font-mono font-medium uppercase tracking-wider cursor-pointer"
              >
                Launch Custom Lab
              </button>
              <button
                onClick={() => navigate('/categories')}
                className="flex-1 btn-precision-secondary py-2.5 text-xs font-mono font-medium uppercase tracking-wider cursor-pointer"
              >
                Browse Hardware
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
                  className="card-precision bg-white overflow-hidden p-0"
                >
                  {/* Order header row */}
                  <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b hairline bg-studio-light/30">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-semibold text-graphite">
                          Order #{order.id.slice(0, 8).toUpperCase()}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="font-mono text-xs text-muted flex flex-wrap items-center gap-3 mt-1">
                        <span className="flex items-center gap-1.5">
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
                        <span className="font-mono text-[10px] text-muted uppercase block">Settled Total</span>
                        <span className="font-display font-semibold text-lg text-saturn-orange">
                          ₹{order.total_amount.toFixed(2)}
                        </span>
                      </div>
                      <button
                        onClick={() => setExpanded(isExpanded ? null : order.id)}
                        className="w-8 h-8 rounded-lg border hairline bg-white flex items-center justify-center hover:bg-studio-light cursor-pointer text-muted hover:text-graphite transition-colors"
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
                    <div className="p-6 bg-studio-light/40 border-t hairline space-y-4">
                      <span className="font-mono text-xs font-semibold uppercase text-saturn-orange block">
                        // Components in Production Run
                      </span>
                      <div className="space-y-2">
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="p-3 bg-white rounded-xl border hairline flex items-center justify-between font-mono text-xs">
                            <div>
                              <div className="font-medium text-graphite">{item.name}</div>
                              <div className="text-[11px] text-muted mt-0.5">
                                Qty: {item.quantity} {item.options?.material ? `• Material: ${item.options.material}` : ''}
                              </div>
                            </div>
                            <div className="font-semibold text-graphite">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>

                      {order.shipping_address && (
                        <div className="p-4 bg-white rounded-xl border hairline font-mono text-xs space-y-1">
                          <div className="font-semibold text-saturn-orange uppercase text-[10px] mb-1">
                            // Delivery Address
                          </div>
                          <div className="text-graphite">{order.shipping_address.line1}</div>
                          <div className="text-muted">
                            {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postal_code}
                          </div>
                          <div className="text-graphite font-medium">{order.shipping_address.country}</div>
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
