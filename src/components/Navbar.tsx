'use client';

import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { totalItems, setIsOpen } = useCart();

  return (
    <nav className="w-full bg-black border-b border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">
        {/* Cart Button — top right */}
        <div className="w-10" /> {/* spacer to balance center */}

        {/* Logo — centered */}
        <span className="absolute left-1/2 -translate-x-1/2 text-white font-black text-2xl uppercase tracking-[0.3em]">
          ENXO
        </span>

        {/* Cart */}
        <button
          onClick={() => setIsOpen(true)}
          className="relative text-white hover:text-gray-300 transition-colors ml-auto"
          aria-label="Open cart"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-white text-black text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center leading-none">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
