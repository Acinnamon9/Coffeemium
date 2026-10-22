# Coffeemium

Coffeemium is an interactive coffee storefront demo built to show how a product brand can move from a polished landing page to catalog browsing, product details, cart, checkout, and admin management.

## Try the demo

1. Open `/demo` to customize predefined products.
2. Change a product name, description, price, or image path.
3. Open the shop to see the edited storefront.
4. Use **Reset demo** to restore the browser-local preview.

Demo edits are stored in the visitor's browser and do not change the shared database.

## Features

- Responsive brand storefront and landing page
- Product catalog with search, roast filtering, and sorting
- Product detail pages backed by Prisma
- Clerk authentication and customer cart flow
- PostgreSQL/Neon database through Prisma
- Admin product management with protected server actions
- Browser-local storefront customization demo
- Test-mode checkout and order flow

## Stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4, Radix UI, Framer Motion
- Prisma 6 with PostgreSQL/Neon
- Clerk authentication
- SWR for client-side data fetching

## Code organization

- `app/` contains App Router pages, route handlers, and server actions.
- `components/` contains UI grouped by storefront area, with shared primitives in `components/ui/`.
- `hooks/` contains client state hooks; `lib/` contains data helpers, integrations, and shared types.
- `prisma/` contains the schema, migrations, seed data, and generated Prisma Client. Generated client files are recreated by `prisma generate` and are ignored by Git.
- `scripts/` contains one off maintenance and database scripts; `docs/` contains implementation notes and reference material.

Clerk is the active sign-in flow. A separate NextAuth route remains for legacy Google OAuth; the two flows are not integrated.

## Local setup

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and provide the database, Clerk, and authentication values. Set `ADMIN_USER_IDS` to a comma-separated list of Clerk user IDs before using the product management actions.

For database setup:

```bash
npx prisma migrate deploy
npx prisma db seed
```

Other scripts:

```bash
npm run lint
npm run build
npm start
```

## Portfolio positioning

This project is a starting point for a custom brand storefront. The coffee catalog can be replaced with a brand's own products, imagery, colors, content, checkout rules, and customer journey.
