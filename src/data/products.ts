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
    name: 'ROOTED CORE TEE',
    price: 65,
    image: '/images/shirt-front.jpg',
    imageBack: '/images/shirt-back.jpg',
    category: 'Apparel',
    badge: 'NEW',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    description: [
      'Screen printed front graphic',
      'Forest green heavyweight cotton',
      'Boxy oversized fit',
    ],
  },
  {
    id: '2',
    name: 'THORN BALACLAVA',
    price: 45,
    image: '/images/skimask-front.jpg',
    imageBack: '/images/skimask-back.jpg',
    category: 'Accessories',
    badge: 'LIMITED',
    description: [
      'Hand bleached & spray dyed',
      'Screen printed thorn detail',
      'One size fits all',
    ],
  },
];
