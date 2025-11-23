import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  sku: string;
  id: number;
  name: string;
  price: number;
  size: string;
  color: string;
  qty: number;
  image: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, opts: { size: string; color: string; qty: number }) => void;
  updateQty: (sku: string, size: string, color: string, qty: number) => void;
  removeFromCart: (sku: string, size: string, color: string) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = 'redeemwear_cart_v1';

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) setCart(JSON.parse(raw));
    } catch (e) {
      console.warn(e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn(e);
    }
  }, [cart]);

  const addToCart = (product: any, opts: { size: string; color: string; qty: number }) => {
    const existingIndex = cart.findIndex(
      c => c.sku === product.sku && c.size === opts.size && c.color === opts.color
    );
    const next = [...cart];
    if (existingIndex >= 0) {
      next[existingIndex].qty += opts.qty;
    } else {
      next.push({
        sku: product.sku,
        id: product.id,
        name: product.name,
        price: product.price_usd,
        size: opts.size,
        color: opts.color,
        qty: opts.qty,
        image: product.images[0]
      });
    }
    setCart(next);
  };

  const updateQty = (sku: string, size: string, color: string, qty: number) => {
    const next = cart.map(item =>
      item.sku === sku && item.size === size && item.color === color
        ? { ...item, qty }
        : item
    );
    setCart(next);
  };

  const removeFromCart = (sku: string, size: string, color: string) =>
    setCart(cart.filter(i => !(i.sku === sku && i.size === size && i.color === color)));

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQty, removeFromCart, clearCart, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
