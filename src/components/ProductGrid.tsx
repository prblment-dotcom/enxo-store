import { products } from '@/data/products';
import ProductCard from './ProductCard';

export default function ProductGrid() {
  return (
    <section className="bg-black min-h-[calc(100vh-3.5rem)] py-8 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
