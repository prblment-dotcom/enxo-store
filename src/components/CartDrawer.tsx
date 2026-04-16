'use client';

import Image from 'next/image';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-[#111111] z-50 flex flex-col shadow-2xl border-l border-[#222222]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#222222]">
          <h2 className="text-white font-bold uppercase tracking-widest text-sm">
            Cart ({items.length})
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close cart"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-sm uppercase tracking-widest">Your cart is empty</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li key={`${item.id}-${item.selectedSize}`} className="flex gap-4 border-b border-[#222222] pb-4">
                  <div className="relative w-16 h-16 bg-[#1a1a1a] shrink-0 overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-bold uppercase truncate">{item.name}</p>
                    {item.selectedSize && (
                      <p className="text-gray-500 text-xs mt-0.5">Size: {item.selectedSize}</p>
                    )}
                    <p className="text-gray-400 text-sm mt-1">${item.price}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize)}
                        className="w-6 h-6 border border-[#333333] text-gray-400 hover:text-white hover:border-gray-500 text-xs flex items-center justify-center transition-colors"
                      >−</button>
                      <span className="text-white text-sm w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}
                        className="w-6 h-6 border border-[#333333] text-gray-400 hover:text-white hover:border-gray-500 text-xs flex items-center justify-center transition-colors"
                      >+</button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id, item.selectedSize)}
                    className="text-gray-600 hover:text-white transition-colors self-start mt-1"
                    aria-label="Remove item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-[#222222] flex flex-col gap-4">
            <div className="flex items-center justify-between text-white">
              <span className="text-sm uppercase tracking-widest text-gray-400">Total</span>
              <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
            </div>
            <button className="w-full bg-white text-black py-4 text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
              Checkout
            </button>
            <button
              onClick={clearCart}
              className="w-full text-gray-600 text-xs uppercase tracking-widest hover:text-white transition-colors"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
