import React, { useState } from 'react';
import { 
  X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, 
  Sparkles, Lock, ShieldCheck, Loader2 
} from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function Cart() {
  const { 
    items, 
    isOpen, 
    setCartOpen, 
    removeItem, 
    updateQuantity, 
    getTotalPrice, 
    getTotalItems,
    clearCart 
  } = useCartStore();

  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isOpen) return null;

  const totalPrice = getTotalPrice();

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/checkout');
  };

  const handleExpressCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((it) => ({
            id: it.id,
            name: it.name,
            price: it.price,
            quantity: it.quantity,
            options: it.options,
          })),
          totalAmount: totalPrice,
          paymentMethod: 'stripe',
        }),
      });

      const data = await response.json();
      if (data && data.orderId) {
        toast.success('Order created successfully!');
        clearCart();
        setCartOpen(false);
        navigate(`/order-success?orderId=${data.orderId}`);
      } else {
        toast.error('Unable to initiate express checkout. Proceeding to standard checkout.');
        navigate('/checkout');
        setCartOpen(false);
      }
    } catch {
      toast.error('Checkout error. Please use standard checkout.');
      navigate('/checkout');
      setCartOpen(false);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const shippingFree = totalPrice >= 1499;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] transition-opacity"
        onClick={() => setCartOpen(false)}
      />

      {/* Cart Drawer */}
      <div className="fixed top-0 right-0 w-full max-w-[420px] h-full bg-[#12151A] text-white shadow-precision-xl z-[80] flex flex-col border-l border-white/10 animate-in slide-in-from-right duration-200 font-body">

        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#181C22]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FF5A1F] flex items-center justify-center text-white">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                Shopping Cart
              </h2>
              <span className="font-mono text-[10px] text-white/50">
                {getTotalItems()} item(s) selected
              </span>
            </div>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="w-8 h-8 rounded-lg hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close Cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Express Delivery Threshold Bar */}
        {items.length > 0 && (
          <div className="px-5 py-3 border-b border-white/10 bg-white/[0.02]">
            <div className="flex justify-between text-xs font-mono text-white/70 mb-1.5">
              <span>{shippingFree ? 'Express Delivery Unlocked' : 'Free Express at ₹1,499'}</span>
              <span className="text-[#FF5A1F] font-semibold">
                {shippingFree ? 'FREE' : `₹${(1499 - totalPrice).toFixed(0)} remaining`}
              </span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FF5A1F] transition-all duration-300 rounded-full"
                style={{ width: `${Math.min((totalPrice / 1499) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 p-6">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-white/40">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1">
                Your cart is empty
              </h3>
              <p className="text-xs text-[#A3A9B3] mb-6 max-w-xs">
                Explore our engineering catalog or upload a custom CAD model for instant quoting.
              </p>
              <button
                onClick={() => {
                  setCartOpen(false);
                  navigate('/categories');
                }}
                className="btn-precision-primary text-xs py-2.5 px-5"
              >
                Browse Hardware Catalog
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex gap-3.5 p-3.5 bg-white/5 rounded-xl border border-white/10"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/5 border border-white/10 shrink-0">
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
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-semibold text-white truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.cartItemId)}
                          className="text-white/40 hover:text-red-400 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.options && (
                        <div className="text-[10px] font-mono text-[#A3A9B3] mt-0.5 truncate">
                          {item.options.material && <span>{item.options.material}</span>}
                          {item.options.color && <span> &bull; {item.options.color}</span>}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/10">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                          className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-mono text-xs font-medium text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono text-xs font-semibold text-[#FF5A1F]">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {items.length > 0 && (
          <div className="p-5 border-t border-white/10 bg-[#181C22]">
            <div className="space-y-2 mb-4 font-mono text-xs">
              <div className="flex justify-between text-white/60">
                <span>Subtotal:</span>
                <span className="text-white">₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>Air Express Shipping:</span>
                <span className={shippingFree ? 'text-emerald-400 font-semibold' : 'text-white'}>
                  {shippingFree ? 'FREE' : '₹149.00'}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-white/10">
                <span className="text-xs font-semibold uppercase text-white/80">Estimated Total:</span>
                <span className="text-xl font-display font-semibold text-white">
                  ₹{(totalPrice + (shippingFree ? 0 : 149)).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={handleCheckout}
                className="btn-precision-primary w-full py-3 text-xs"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center justify-between pt-1 font-mono text-xs">
                <button
                  onClick={() => setCartOpen(false)}
                  className="text-white/60 hover:text-white transition-colors cursor-pointer text-[11px]"
                >
                  &larr; Continue browsing
                </button>
                <button
                  onClick={() => {
                    clearCart();
                    toast.success('Cart cleared');
                  }}
                  className="text-red-400 hover:text-red-300 transition-colors cursor-pointer text-[11px]"
                >
                  Clear all
                </button>
              </div>

              <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] font-mono text-white/40">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FF5A1F]" />
                <span>256-Bit SSL Encrypted &bull; Direct Bhopal Hub Dispatch</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
