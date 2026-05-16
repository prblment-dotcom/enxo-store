import { notFound } from 'next/navigation';
import { productRoutes } from '@/data/products';
import { getProductById } from '@/lib/shopify';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductDetail from '@/components/ProductDetail';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const route = productRoutes.find((p) => p.id === params.id);
  if (!route) return notFound();

  const product = await getProductById(route.shopifyId);
  if (!product) return notFound();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <ProductDetail product={product} shopifyId={route.shopifyId} />
      <Footer />
    </div>
  );
}
