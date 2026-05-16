'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ShopifyProduct } from '@/lib/shopify';
import { formatPrice } from '@/lib/currency';
import ShopifyBuyButton from './ShopifyBuyButton';

export default function ProductDetail({
  product,
  shopifyId,
}: {
  product: ShopifyProduct;
  shopifyId: string;
}) {
  const images = product.images.edges.map((e) => e.node);
  const [activeIndex, setActiveIndex] = useState(0);
  const price = formatPrice(
    product.priceRange.minVariantPrice.amount,
    product.priceRange.minVariantPrice.currencyCode
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-16 items-start">

      {/* ── Images ── */}
      <div className="flex flex-col gap-3">
        <div className="relative aspect-square bg-[#0a0a0a] overflow-hidden">
          {images[activeIndex] && (
            <Image
              src={images[activeIndex].url}
              alt={images[activeIndex].altText ?? product.title}
              fill
              className="object-contain"
              priority
            />
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 border-2 transition-colors overflow-hidden ${
                  activeIndex === i ? 'border-white' : 'border-[#333]'
                }`}
              >
                <Image
                  src={img.url}
                  alt={i === 0 ? 'Front' : i === 1 ? 'Back' : `View ${i + 1}`}
                  fill
                  className="object-contain"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col gap-6 sm:pt-2">

        {/* Title + Price */}
        <div className="flex flex-col gap-2">
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-widest leading-tight">
            {product.title}
          </h1>
          <p className="text-white text-xl font-bold">{price}</p>
        </div>

        {/* Shopify Buy Button */}
        <ShopifyBuyButton shopifyProductId={shopifyId} />

        {/* Description */}
        {product.description && (
          <div className="border-t border-[#222] pt-5 flex flex-col gap-3">
            <p className="text-xs uppercase tracking-widest text-gray-500 leading-relaxed">
              {product.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
