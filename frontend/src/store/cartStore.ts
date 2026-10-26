import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Keep Product interface here for cart (subset of API Product)
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock?: number;
  options?: Record<string, any>;
}

export interface CartItem extends Product {
  cartItemId: string;
  quantity: number;
  options?: Record<string, any>;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number, options?: Record<string, any>) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1, options = {}) => {
        const { items } = get();
        
        // Merge options from both sources if they exist
        const finalOptions = { ...product.options, ...options };
        
        // Generate a unique key for this combination of product + options
        const cartItemId = `${product.id}-${Object.values(finalOptions).sort().join('-')}`;

        const existingItem = items.find((item) => item.cartItemId === cartItemId);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.cartItemId === cartItemId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                ...product,
                cartItemId,
                quantity,
                options: finalOptions,
              },
            ],
          });
        }
      },

      removeItem: (cartItemId) => {
        set({ items: get().items.filter((item) => item.cartItemId !== cartItemId) });
      },

      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.cartItemId === cartItemId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      setCartOpen: (isOpen) => set({ isOpen }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'printforge-cart',
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state?.items) {
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          const sanitizedItems = state.items.filter((item: any) => uuidRegex.test(item.id));
          
          if (sanitizedItems.length !== state.items.length) {
            console.log('[CartStore] Sanitized legacy mock items from cart');
            state.items = sanitizedItems;
          }
        }
      },
    }
  )
);
