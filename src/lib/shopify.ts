const DOMAIN = '4aiaw0-hd.myshopify.com';
const TOKEN = '51418e9dc53708739b3cf1a6e3b24307';
const API_URL = `https://${DOMAIN}/api/2024-01/graphql.json`;

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: {
      node: {
        url: string;
        altText: string | null;
      };
    }[];
  };
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
      };
    }[];
  };
}

async function shopifyFetch(query: string, variables = {}) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });
  const json = await res.json();
  return json.data;
}

export async function getProductById(shopifyId: string): Promise<ShopifyProduct | null> {
  const gid = `gid://shopify/Product/${shopifyId}`;
  const data = await shopifyFetch(
    `query GetProduct($id: ID!) {
      product(id: $id) {
        id
        title
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 20) {
          edges {
            node {
              id
              title
              availableForSale
            }
          }
        }
      }
    }`,
    { id: gid }
  );
  return data?.product ?? null;
}

export async function getAllProducts(shopifyIds: string[]): Promise<ShopifyProduct[]> {
  const products = await Promise.all(shopifyIds.map(getProductById));
  return products.filter(Boolean) as ShopifyProduct[];
}
