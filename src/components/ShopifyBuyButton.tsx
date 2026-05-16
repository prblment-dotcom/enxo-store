'use client';

import { useEffect, useRef } from 'react';

interface ShopifyBuyButtonProps {
  shopifyProductId: string;
}

declare global {
  interface Window {
    ShopifyBuy: any;
  }
}

export default function ShopifyBuyButton({ shopifyProductId }: ShopifyBuyButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const SCRIPT_URL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';

    function init() {
      const client = window.ShopifyBuy.buildClient({
        domain: '4aiaw0-hd.myshopify.com',
        storefrontAccessToken: '51418e9dc53708739b3cf1a6e3b24307',
      });

      window.ShopifyBuy.UI.onReady(client).then(function (ui: any) {
        if (!containerRef.current) return;
        ui.createComponent('product', {
          id: shopifyProductId,
          node: containerRef.current,
          moneyFormat: '%24%7B%7Bamount%7D%7D',
          options: {
            product: {
              styles: {
                product: {
                  '@media (min-width: 601px)': {
                    'max-width': '100%',
                    'margin-left': '0px',
                    'margin-bottom': '0px',
                  },
                },
                button: {
                  'font-family': 'inherit',
                  'font-size': '12px',
                  'font-weight': '900',
                  'letter-spacing': '0.15em',
                  'text-transform': 'uppercase',
                  'padding-top': '16px',
                  'padding-bottom': '16px',
                  color: '#000000',
                  ':hover': {
                    color: '#000000',
                    'background-color': '#d4d4d4',
                  },
                  'background-color': '#ffffff',
                  ':focus': {
                    'background-color': '#d4d4d4',
                  },
                  'border-radius': '0px',
                  'padding-left': '0px',
                  'padding-right': '0px',
                },
              },
              contents: {
                img: false,
                title: false,
                price: false,
              },
              text: {
                button: 'Add to Cart',
              },
            },
            cart: {
              styles: {
                button: {
                  'font-family': 'inherit',
                  'font-size': '12px',
                  'font-weight': '900',
                  'letter-spacing': '0.15em',
                  'text-transform': 'uppercase',
                  color: '#000000',
                  'background-color': '#ffffff',
                  ':hover': { 'background-color': '#d4d4d4', color: '#000000' },
                  ':focus': { 'background-color': '#d4d4d4' },
                  'border-radius': '0px',
                },
                cart: {
                  'background-color': '#111111',
                },
                header: {
                  color: '#ffffff',
                },
                lineItems: {
                  color: '#ffffff',
                },
                subtotalText: {
                  color: '#ffffff',
                },
                subtotal: {
                  color: '#ffffff',
                },
                notice: {
                  color: '#ffffff',
                },
                currency: {
                  color: '#ffffff',
                },
                close: {
                  color: '#ffffff',
                  ':hover': { color: '#ffffff' },
                },
                empty: {
                  color: '#ffffff',
                },
                noteDescription: {
                  color: '#ffffff',
                },
                discountText: {
                  color: '#ffffff',
                },
                discountIcon: {
                  fill: '#ffffff',
                },
                discountAmount: {
                  color: '#ffffff',
                },
              },
              text: {
                total: 'Subtotal',
                button: 'Checkout',
              },
            },
            toggle: {
              styles: {
                toggle: {
                  'background-color': '#ffffff',
                  ':hover': { 'background-color': '#d4d4d4' },
                  ':focus': { 'background-color': '#d4d4d4' },
                },
                count: {
                  color: '#000000',
                  ':hover': { color: '#000000' },
                },
                iconPath: {
                  fill: '#000000',
                },
              },
            },
          },
        });
      });
    }

    if (window.ShopifyBuy?.UI) {
      init();
    } else if (window.ShopifyBuy) {
      init();
    } else {
      const script = document.createElement('script');
      script.async = true;
      script.src = SCRIPT_URL;
      script.onload = init;
      document.head.appendChild(script);
    }
  }, [shopifyProductId]);

  return <div ref={containerRef} className="w-full shopify-buy-btn-wrapper" />;
}
