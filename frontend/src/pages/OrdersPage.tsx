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
  pending:    { colors: 'bg-amber-50 text-amber-700 border-amber-200',   label: 'Pending',    step: 0 },
  paid:       { colors: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Paid',   step: 1 },
  processing: { colors: 'bg-orange-50 text-[#F7931E] border-orange-200', label: 'Processing', step: 2 },
  shipped:    { colors: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Shipped',   step: 3 },
  delivered:  { colors: 'bg-green-50 text-green-700 border-green-200',   label: 'Delivered',  step: 4 },
  cancelled:  { colors: 'bg-red-50 text-red-700 border-red-200',         label: 'Cancelled',  step: -1 },
  refunded:   { colors: 'bg-slate-50 text-slate-700 border-slate-200',   label: 'Refunded',   step: -1 },
};

const TIMELINE_STEPS = ['Pending', 'Paid', 'Processing', 'Shipped', 'Delivered'];

// ─── Order Timeline ─────────────────────────────────────────────────────────────
function OrderTimeline({ status }: { status: string }) {
  const currentStep = STATUS_CONFIG[status]?.step ?? 0;
  if (currentStep < 0) return null; // don't show for cancelled/refunded

  return (
    <div className="flex items-center mt-3">
      {TIMELINE_STEPS.map((step, i) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[8px] font-black transition-all ${
              i < currentStep ? 'bg-emerald-500 border-emerald-500 text-white'
              : i === currentStep ? 'bg-black border-black text-white'
              : 'bg-white border-slate-300 text-slate-400'
            }`}>
              {i < currentStep ? '✓' : i + 1}
            </div>
            <span className={`text-[8px] font-black uppercase tracking-wider whitespace-nowrap ${
              i <= currentStep ? 'text-black' : 'text-slate-400'
            }`}>{step}</span>
          </div>
          {i < TIMELINE_STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 mb-5 ${i < currentStep ? 'bg-emerald-400' : 'bg-slate-200'}`} />
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
    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${config.colors}`}>
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
      <div className="min-h-screen flex items-center justify-center bg-white pt-24">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-black tracking-tighter mb-2">My Orders</h1>
            <p className="text-slate-400 font-medium">
              {orders.length > 0
                ? `${orders.length} order${orders.length > 1 ? 's' : ''} found`
                : 'Track and review your purchase history'}
            </p>
          </div>
          {orders.length > 0 && (
            <button
              onClick={() => fetchOrders(true)}
              disabled={refreshing}
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors"
            >
              <RotateCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          )}
        </div>

        {/* Empty state */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
              <ShoppingBag className="w-9 h-9 text-slate-300" />
            </div>
            <h3 className="font-black text-xl text-black mb-2 tracking-tight">No orders yet</h3>
            <p className="text-slate-400 font-medium mb-8">You haven't placed any orders. Start shopping!</p>
            <Button
              onClick={() => navigate('/products')}
              className="h-12 px-8 bg-black hover:bg-primary text-white font-black uppercase tracking-widest text-xs rounded-xl"
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expanded === order.id;
              const config = STATUS_CONFIG[order.status];
              const isCancelledOrRefunded = order.status === 'cancelled' || order.status === 'refunded';

              return (
                <div key={order.id} className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">

                  {/* Order Header */}
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => setExpanded(isExpanded ? null : order.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        isCancelledOrRefunded ? 'bg-slate-200' : 'bg-black'
                      }`}>
                        <Package className={`w-6 h-6 ${isCancelledOrRefunded ? 'text-slate-500' : 'text-white'}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Hash className="w-3 h-3 text-slate-400" />
                          <span className="font-black text-sm text-black">
                            {order.id.slice(0, 8).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span className="text-xs text-slate-400 font-medium">
                            {new Date(order.created_at).toLocaleDateString('en-US', {
                              year: 'numeric', month: 'short', day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <div className="font-black text-primary">${order.total_amount.toFixed(2)}</div>
                        <div className="text-xs text-slate-400 font-medium">
                          {order.order_items?.length ?? 0} item{(order.order_items?.length ?? 0) !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <StatusBadge status={order.status} />
                      {isExpanded
                        ? <ChevronUp className="w-4 h-4 text-slate-400" />
                        : <ChevronDown className="w-4 h-4 text-slate-400" />
                      }
                    </div>
                  </div>

                  {/* Progress Timeline */}
                  {!isCancelledOrRefunded && (
                    <div className="px-6 pb-4">
                      <OrderTimeline status={order.status} />
                    </div>
                  )}

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 p-6 space-y-4 bg-slate-50/60">

                      {/* Mobile total */}
                      <div className="flex justify-between items-center sm:hidden">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total</span>
                        <span className="font-black text-primary">${order.total_amount.toFixed(2)}</span>
                      </div>

                      {/* Items */}
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                          Order Items
                        </div>
                        <div className="space-y-2">
                          {(order.order_items || []).map((item) => (
                            <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="font-black text-sm text-black truncate">{item.name}</div>
                                {item.options?.material && (
                                  <div className="text-[10px] text-primary/60 font-bold uppercase tracking-widest leading-none mt-1">
                                    {item.options.material}
                                  </div>
                                )}
                                <div className="text-xs text-slate-400 font-medium mt-1.5">
                                  {item.quantity} × ${item.price.toFixed(2)}
                                </div>
                              </div>
                              <div className="font-black text-sm text-primary flex-shrink-0">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping address */}
                      {order.shipping_address && (
                        <div className="p-4 rounded-xl bg-white border border-slate-100">
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              Shipping Address
                            </span>
                          </div>
                          <div className="text-xs font-medium text-slate-600 leading-relaxed">
                            {order.shipping_address.line1},<br />
                            {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code},<br />
                            {order.shipping_address.country}
                          </div>
                        </div>
                      )}

                      {/* Total */}
                      <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total Paid</span>
                        <span className="font-black text-xl text-black">${order.total_amount.toFixed(2)}</span>
                      </div>

                      {/* Reorder CTA */}
                      <Button
                        variant="outline"
                        onClick={() => navigate('/products')}
                        className="w-full h-11 rounded-xl border-slate-200 font-black uppercase tracking-widest text-xs hover:border-black hover:text-black"
                      >
                        Shop Again
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <CTA />
    </div>
  );
}
