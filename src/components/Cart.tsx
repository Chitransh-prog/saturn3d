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
      const data = res.data.data;
      clearCart();
      setCartOpen(false);
      if (data?.checkoutUrl) {
        toast.success('Redirecting to checkout…');
        window.location.href = data.checkoutUrl;
      } else {
        navigate('/checkout');
      }
    } catch (err) {
      toast.error(getApiError(err));
      setIsCheckingOut(false);
      setCartOpen(false);
      navigate('/checkout');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  const shippingFree = totalPrice >= 1499;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0B0B0B]/70 backdrop-blur-xs z-[70] transition-opacity"
        onClick={() => setCartOpen(false)}
      />

      {/* Cart Drawer */}
      <div className="fixed top-0 right-0 w-full max-w-[440px] h-full bg-[#FAF7F2] shadow-brutal-xl z-[80] flex flex-col border-l-4 border-ink animate-in slide-in-from-right duration-200">

        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b-3 border-ink bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#FF5A1F] border-2 border-ink flex items-center justify-center text-[#0B0B0B] shadow-brutal-sm">
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h2 className="font-display font-black text-lg uppercase tracking-tight text-[#0B0B0B]">
              ORDER MANIFEST
            </h2>
            <span className="badge-sticker bg-[#FFE14D] text-[11px]">
              {getTotalItems()} ITEMS
            </span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="w-8 h-8 rounded-xs bg-white border-2 border-ink shadow-brutal-sm flex items-center justify-center hover:bg-[#FFE14D] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all cursor-pointer"
            title="Close Cart"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {items.length > 0 && !shippingFree && (
          <div className="px-5 py-3 bg-[#FFE14D] border-b-3 border-ink">
            <div className="flex justify-between text-xs font-mono font-bold text-[#0B0B0B] mb-1.5">
              <span>EXPRESS DELIVERY UNLOCK AT ₹1,499</span>
              <span className="text-[#FF5A1F] font-black">₹{(1499 - totalPrice).toFixed(2)} REMAINING</span>
            </div>
            <div className="h-2.5 bg-white border-2 border-ink overflow-hidden">
              <div
                className="h-full bg-[#FF5A1F] transition-all duration-300"
                style={{ width: `${Math.min((totalPrice / 1499) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
        {items.length > 0 && shippingFree && (
          <div className="px-5 py-2.5 bg-[#7CF2C1] border-b-3 border-ink flex items-center justify-center gap-2 text-xs font-mono font-bold text-[#0B0B0B]">
            <Sparkles className="w-4 h-4 text-[#0B0B0B]" />
            <span>EXPRESS COURIER DELIVERY UNLOCKED!</span>
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3 blueprint-grid">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 card-slab bg-white p-6">
              <div className="w-16 h-16 rounded-xs bg-[#FAF7F2] border-3 border-ink shadow-brutal flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-[#0B0B0B]" />
              </div>
              <h3 className="font-display font-black text-lg text-[#0B0B0B] uppercase mb-1">
                MANIFEST IS EMPTY
              </h3>
              <p className="font-mono text-xs text-[#555] mb-6 max-w-xs">
                Explore our precision catalog or launch the instant CAD slicer lab.
              </p>
              <button
                onClick={() => {
                  setCartOpen(false);
                  navigate('/categories');
                }}
                className="btn-brutal btn-brutal-orange text-xs py-2.5 px-6"
              >
                BROWSE HARDWARE CATALOG
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex gap-3.5 p-3.5 bg-white rounded-xs border-2 border-ink shadow-brutal-sm"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xs overflow-hidden bg-[#FAF7F2] border-2 border-ink shrink-0">
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
                        <h4 className="font-display font-black text-xs text-[#0B0B0B] uppercase truncate">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.cartItemId)}
                          className="text-[#999] hover:text-red-600 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.options && (
                        <div className="text-[10px] font-mono text-[#555] mt-0.5 truncate">
                          {item.options.material && <span>{item.options.material}</span>}
                          {item.options.color && <span> &bull; {item.options.color}</span>}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-ink/20">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, Math.max(1, item.quantity - 1))}
                          className="w-6 h-6 bg-[#FAF7F2] border border-ink flex items-center justify-center hover:bg-[#FFE14D] font-bold text-xs"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-mono font-bold text-xs">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="w-6 h-6 bg-[#FAF7F2] border border-ink flex items-center justify-center hover:bg-[#FFE14D] font-bold text-xs"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-display font-black text-sm text-[#FF5A1F]">
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
          <div className="p-5 border-t-3 border-ink bg-white">
            <div className="space-y-2 mb-4 font-mono text-xs">
              <div className="flex justify-between text-[#555]">
                <span>FABRICATION SUBTOTAL:</span>
                <span className="font-bold text-[#0B0B0B]">₹{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#555]">
                <span>AIR EXPRESS LOGISTICS:</span>
                <span className={`font-bold ${shippingFree ? 'text-[#0B0B0B] bg-[#7CF2C1] px-1' : 'text-[#0B0B0B]'}`}>
                  {shippingFree ? 'FREE' : '₹149.00'}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t-2 border-ink">
                <span className="font-display font-black text-sm uppercase text-[#0B0B0B]">NET TOTAL:</span>
                <span className="font-display font-black text-2xl text-[#FF5A1F]">
                  ₹{(totalPrice + (shippingFree ? 0 : 149)).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5">
              <button
                onClick={handleCheckout}
                className="btn-brutal btn-brutal-orange w-full py-3.5 text-xs flex items-center justify-center gap-2"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              {isAuthenticated && (
                <button
                  onClick={handleExpressCheckout}
                  disabled={isCheckingOut}
                  className="btn-brutal bg-white w-full py-3 text-xs flex items-center justify-center gap-1.5"
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      REDIRECTING TO STRIPE GATEWAY…
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 mr-1.5" />
                      INSTANT STRIPE EXPRESS
                    </>
                  )}
                </button>
              )}

              <div className="flex items-center justify-between pt-1 font-mono text-xs">
                <button
                  onClick={() => setCartOpen(false)}
                  className="underline font-bold text-[#0B0B0B] hover:text-[#FF5A1F] cursor-pointer"
                >
                  &larr; Return to Catalog
                </button>
                <button
                  onClick={() => {
                    clearCart();
                    toast.success('Manifest cleared');
                  }}
                  className="text-red-600 hover:underline font-bold cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              <div className="pt-2 flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#555]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0B0B0B]" />
                <span>256-BIT ENCRYPTED &bull; ZERO DATA LEAKAGE</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
