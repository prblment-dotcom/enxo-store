'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { Product } from '@/data/products';

export default function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  const currentImage =
    hovered && product.imageBack ? product.imageBack : product.image;

  return (
    <div
      className="group flex flex-col bg-black cursor-pointer"
      onClick={() => router.push(`/products/${product.id}`)}
    >
      {/* Image */}
      <div
        className="relative aspect-square overflow-hidden bg-black"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Image
          src={currentImage}
          alt={product.name}
          fill
          className="object-contain transition-opacity duration-300"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest border border-white text-white px-2 py-0.5">
            {product.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="pt-4 text-center flex flex-col gap-1">
        <h3 className="text-white text-xs font-bold uppercase tracking-widest">{product.name}</h3>
        <span className="text-white text-xs font-bold">${product.price}.00</span>
      </div>
    </div>
  );
}
