import { productRoutes } from '@/data/products';
import { getAllProducts } from '@/lib/shopify';
import ProductCard from './ProductCard';

export default async function ProductGrid() {
  const shopifyIds = productRoutes.map((r) => r.shopifyId);
  const shopifyProducts = await getAllProducts(shopifyIds);

  const products = productRoutes.map((route) => {
    const shopify = shopifyProducts.find(
      (p) => p.id === `gid://shopify/Product/${route.shopifyId}`
    );
    return { route, shopify };
  }).filter((p) => p.shopify != null);

  return (
    <section className="bg-black min-h-[calc(100vh-3.5rem)] py-8 sm:py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map(({ route, shopify }) => (
            <ProductCard key={route.id} routeId={route.id} product={shopify!} />
          ))}
        </div>
      </div>
    </section>
  );
}
