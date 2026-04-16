# ENXO Store

Official merch store for **Enxo** — built with Next.js, TypeScript, and Tailwind CSS.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: React Context (Cart)

## Project Structure

```
src/
├── app/              # App Router pages & layout
├── components/       # UI components
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── CartDrawer.tsx
│   └── Footer.tsx
├── context/          # Cart state
│   └── CartContext.tsx
└── data/             # Product data & types
    └── products.ts
public/
└── images/           # Replace placeholders with real product images
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Adding Products

Edit `src/data/products.ts` to add or update products. Replace the placeholder images in `public/images/` with real product photos.

## Notes

- Product images in `public/images/` are **placeholders** — replace with actual product photos.
- The **Checkout** button is a placeholder — connect to a payment processor (e.g., Stripe) when ready.
