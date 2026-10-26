import { useState } from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight, Loader2, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { ordersApi, getApiError } from '@/lib/api';

export default function Cart() {
  const {
    items,
    isOpen,
    setCartOpen,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const totalPrice = getTotalPrice();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!isAuthenticated) {
      toast.info('Please sign in to checkout', {
        action: {
          label: 'Sign In',
          onClick: () => {
            setCartOpen(false);
            navigate('/login', { state: { from: '/checkout' } });
          },
        },
      });
      return;
    }

    setCartOpen(false);
    navigate('/checkout');
  };

  const handleExpressCheckout = async () => {
    if (!isAuthenticated || items.length === 0) return;
    setIsCheckingOut(true);
    try {
      const cartItems = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        options: item.options,
      }));
      const res = await ordersApi.createCheckout({ items: cartItems });
      const { checkoutUrl } = res.data.data!;
      clearCart();
      setCartOpen(false);
      toast.success('Redirecting to Stripe checkout…');
      window.location.href = checkoutUrl;
    } catch (err) {
      toast.error(getApiError(err));
      setIsCheckingOut(false);
      setCartOpen(false);
      navigate('/checkout');
    }
  };

  if (!isOpen) return null;

  const shippingFree = totalPrice >= 50;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[70] transition-opacity"
        onClick={() => setCartOpen(false)}
      />

      {/* Cart Drawer */}
      <div className="fixed top-0 right-0 w-full max-w-[420px] h-full bg-white shadow-2xl z-[80] flex flex-col border-l border-slate-200/80 animate-in slide-in-from-right duration-300">

        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-heading text-lg font-bold text-slate-900">Your Cart</h2>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              {getTotalItems()}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCartOpen(false)}
            className="h-9 w-9 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900"
            title="Close Cart"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Free Shipping Progress */}
        {items.length > 0 && !shippingFree && (
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
              <span>Free Express Delivery at $50</span>
              <span className="text-primary font-bold">${(50 - totalPrice).toFixed(2)} away</span>
            </div>
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F7931E] rounded-full transition-all duration-500"
                style={{ width: `${Math.min((totalPrice / 50) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
        {items.length > 0 && shippingFree && (
          <div className="px-5 py-2.5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Unlocked Free Express Shipping!</span>
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-slate-300" />
              </div>
              <h3 className="font-bold text-base text-slate-800 mb-1">Your cart is empty</h3>
              <p className="text-slate-500 text-xs mb-6 max-w-xs">
                Explore our catalog of 3D parts or launch the custom upload studio.
              </p>
              <Button
                onClick={() => {
                  setCartOpen(false);
                  navigate('/categories');
                }}
                className="h-10 px-5 rounded-xl bg-slate-900 hover:bg-primary text-white font-bold text-xs shadow-sm transition-all"
              >
                Browse Catalog
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex gap-3.5 p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/products/vase.jpg';
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{item.name}</h4>
                      <button
                        onClick={() => removeItem(item.cartItemId)}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                      {item.category}
                    </p>

                    {item.options?.material && (
                      <p className="text-[11px] text-primary font-semibold truncate mt-0.5">
                        {item.options.material} {item.options.infill ? `• ${item.options.infill}` : ''}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      <span className="font-extrabold text-slate-900 text-sm">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-slate-100 rounded-lg p-0.5">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center font-bold text-xs text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="p-5 border-t border-slate-100 bg-slate-50/60">
            <div className="space-y-2 mb-4 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Estimated Shipping</span>
                <span className={`font-bold ${shippingFree ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {shippingFree ? 'FREE' : '$9.99'}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-extrabold text-xl text-primary">
                  ${(totalPrice + (shippingFree ? 0 : 9.99)).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <button
                onClick={handleCheckout}
                className="w-full h-12 rounded-full bg-black hover:bg-neutral-800 text-white font-heading font-black text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {isAuthenticated && (
                <button
                  onClick={handleExpressCheckout}
                  disabled={isCheckingOut}
                  className="w-full h-11 rounded-full border border-black/10 bg-[#FAFAFA] hover:bg-white text-black font-heading font-bold text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-1.5"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      Redirecting to Stripe…
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                      Instant Stripe Express
                    </>
                  )}
                </button>
              )}

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setCartOpen(false)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                  Keep Shopping
                </button>
                <button
                  onClick={() => {
                    clearCart();
                    toast.success('Cart cleared');
                  }}
                  className="text-xs font-semibold text-slate-400 hover:text-red-500"
                >
                  Clear Cart
                </button>
              </div>

              <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-bit SSL Encrypted • Stripe Security</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
