'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);

  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [activeImage, setActiveImage] = useState<'front' | 'back'>('front');
  const [sizeError, setSizeError] = useState(false);
  const { addToCart, setIsOpen } = useCart();

  if (!product) return notFound();

  const isSoldOut = product.badge === 'SOLD OUT';

  function handleAddToCart() {
    if (product!.sizes && !selectedSize) {
      setSizeError(true);
      return;
    }
    addToCart(product!, selectedSize);
    setSizeError(false);
    setIsOpen(true);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 items-start">

        {/* Images */}
        <div className="flex flex-col gap-3">
          {/* Main image */}
          <div className="relative aspect-square bg-black overflow-hidden">
            <Image
              src={activeImage === 'back' && product.imageBack ? product.imageBack : product.image}
              alt={product.name}
              fill
              className="object-contain"
              priority
            />
            {product.badge && (
              <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest border border-white text-white px-2 py-0.5">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.imageBack && (
            <div className="flex gap-2">
              <button
                onClick={() => setActiveImage('front')}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 border-2 transition-colors overflow-hidden ${activeImage === 'front' ? 'border-white' : 'border-[#333]'}`}
              >
                <Image src={product.image} alt="Front" fill className="object-contain" />
              </button>
              <button
                onClick={() => setActiveImage('back')}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 border-2 transition-colors overflow-hidden ${activeImage === 'back' ? 'border-white' : 'border-[#333]'}`}
              >
                <Image src={product.imageBack} alt="Back" fill className="object-contain" />
              </button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-5 sm:gap-6 sm:pt-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-widest leading-tight">{product.name}</h1>
            <p className="text-white text-lg sm:text-xl font-bold mt-2">${product.price}.00</p>
          </div>

          {/* Size Selector */}
          {product.sizes && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-gray-400">Size</span>
                {sizeError && (
                  <span className="text-xs text-red-400 uppercase tracking-wider">Please select a size</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setSizeError(false); }}
                    className={`px-4 py-3 sm:py-2 text-xs uppercase tracking-widest border transition-colors min-w-[3rem] ${
                      selectedSize === size
                        ? 'bg-white text-black border-white'
                        : 'bg-transparent text-gray-400 border-[#333] hover:border-white hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={isSoldOut}
            className={`w-full py-4 text-sm font-black uppercase tracking-widest transition-colors ${
              isSoldOut
                ? 'bg-[#111] text-gray-600 cursor-not-allowed border border-[#333]'
                : 'bg-white text-black active:bg-gray-300'
            }`}
          >
            {isSoldOut ? 'Sold Out' : 'Add to Cart'}
          </button>

          {/* Description */}
          {product.description && (
            <ul className="flex flex-col gap-2 border-t border-[#222] pt-5 mt-1">
              {product.description.map((line, i) => (
                <li key={i} className="text-xs uppercase tracking-widest text-gray-500 flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-600 rounded-full shrink-0" />
                  {line}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
