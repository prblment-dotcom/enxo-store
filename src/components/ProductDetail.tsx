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
  const price = formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode);
  const descriptionLines = product.description
    ? product.description.split('\n').filter(Boolean)
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 items-start">
      {/* Images */}
      <div className="flex flex-col gap-3">
        <div className="relative aspect-square bg-black overflow-hidden">
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
          <div className="flex gap-2 flex-wrap">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 border-2 transition-colors overflow-hidden ${
                  activeIndex === i ? 'border-white' : 'border-[#333]'
                }`}
              >
                <Image src={img.url} alt={img.altText ?? `View ${i + 1}`} fill className="object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-5 sm:gap-6 sm:pt-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-widest leading-tight">
            {product.title}
          </h1>
          <p className="text-white text-lg sm:text-xl font-bold mt-2">{price}</p>
        </div>

        {/* Shopify Buy Button (handles size/variant selection + checkout) */}
        <ShopifyBuyButton shopifyProductId={shopifyId} />

        {/* Description */}
        {descriptionLines.length > 0 && (
          <ul className="flex flex-col gap-2 border-t border-[#222] pt-5 mt-1">
            {descriptionLines.map((line, i) => (
              <li key={i} className="text-xs uppercase tracking-widest text-gray-500 flex items-center gap-2">
                <span className="w-1 h-1 bg-gray-600 rounded-full shrink-0" />
                {line}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
