'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { ShopifyProduct } from '@/lib/shopify';

export default function ProductCard({
  routeId,
  product,
}: {
  routeId: string;
  product: ShopifyProduct;
}) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  const images = product.images.edges.map((e) => e.node);
  const frontImage = images[0];
  const backImage = images[1];
  const currentImage = hovered && backImage ? backImage : frontImage;
  const price = parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2).replace('.00', '');

  if (!frontImage) return null;

  return (
    <div
      className="group flex flex-col bg-black cursor-pointer"
      onClick={() => router.push(`/products/${routeId}`)}
    >
      <div
        className="relative aspect-square overflow-hidden bg-black"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Image
          src={currentImage.url}
          alt={currentImage.altText ?? product.title}
          fill
          className="object-contain transition-opacity duration-300"
        />
      </div>

      <div className="pt-4 text-center flex flex-col gap-1">
        <h3 className="text-white text-xs font-bold uppercase tracking-widest">{product.title}</h3>
        <span className="text-white text-xs font-bold">${price}</span>
      </div>
    </div>
  );
}
