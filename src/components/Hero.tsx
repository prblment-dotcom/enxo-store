'use client';

import { useCart } from '@/context/CartContext';

export default function Hero() {
  const { setIsOpen } = useCart();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white overflow-hidden pt-16">
      {/* Background subtle grid */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 text-center px-4">
        <p className="text-xs uppercase tracking-[0.4em] text-gray-500 mb-6">Official Merch</p>
        <h1 className="text-[clamp(4rem,15vw,12rem)] font-black uppercase leading-none tracking-tighter text-white">
          ENXO
        </h1>
        <p className="mt-6 text-gray-400 text-sm uppercase tracking-widest max-w-md mx-auto">
          Limited drops. No restocks. Get yours now.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#shop"
            className="px-10 py-4 bg-white text-black text-sm font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
          >
            Shop Now
          </a>
          <button
            onClick={() => setIsOpen(true)}
            className="px-10 py-4 border border-white text-white text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
          >
            View Cart
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gray-600 animate-pulse" />
      </div>
    </section>
  );
}
