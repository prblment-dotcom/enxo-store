'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Product } from '@/data/products';

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (id: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, size?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = useCallback((product: Product, size?: string) => {
    setItems((prev) => {
      const key = `${product.id}-${size ?? ''}`;
      const existing = prev.find((i) => `${i.id}-${i.selectedSize ?? ''}` === key);
      if (existing) {
        return prev.map((i) =>
          `${i.id}-${i.selectedSize ?? ''}` === key ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((id: string, size?: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.id === id && (i.selectedSize ?? '') === (size ?? '')))
    );
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number, size?: string) => {
    if (quantity <= 0) { removeFromCart(id, size); return; }
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && (i.selectedSize ?? '') === (size ?? '') ? { ...i, quantity } : i
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
