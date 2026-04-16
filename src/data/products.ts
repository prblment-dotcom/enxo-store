export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  imageBack?: string;
  category: string;
  badge?: string;
  sizes?: string[];
  description?: string[];
}

export const products: Product[] = [
  {
    id: '1',
    name: 'ENXO Hoodie',
    price: 85,
    image: '/images/hoodie-front.jpg',
    imageBack: '/images/hoodie-back.jpg',
    category: 'Apparel',
    badge: 'NEW',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: [
      'Screen printed front + back graphics',
      'Premium heavyweight fleece',
      'Oversized fit',
    ],
  },
  {
    id: '2',
    name: 'ENXO Hoodie',
    price: 85,
    image: '/images/hoodie-front.jpg',
    imageBack: '/images/hoodie-back.jpg',
    category: 'Apparel',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: [
      'Screen printed front + back graphics',
      'Premium heavyweight fleece',
      'Oversized fit',
    ],
  },
  {
    id: '3',
    name: 'ENXO Hoodie',
    price: 85,
    image: '/images/hoodie-front.jpg',
    imageBack: '/images/hoodie-back.jpg',
    category: 'Apparel',
    badge: 'LIMITED',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: [
      'Screen printed front + back graphics',
      'Premium heavyweight fleece',
      'Oversized fit',
    ],
  },
  {
    id: '4',
    name: 'ENXO Hoodie',
    price: 85,
    image: '/images/hoodie-front.jpg',
    imageBack: '/images/hoodie-back.jpg',
    category: 'Apparel',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: [
      'Screen printed front + back graphics',
      'Premium heavyweight fleece',
      'Oversized fit',
    ],
  },
];
