# Tech Stack

## Application

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS 4
- Radix UI primitives with local components in `components/ui`
- Framer Motion, Lucide React, and Sonner

## Data and server state

- PostgreSQL, configured for Neon
- Prisma 6 with Prisma Accelerate
- Zod for request validation
- SWR for client side data fetching

## Authentication

- Clerk is the authentication provider used by the storefront and protected server routes.
- A NextAuth Google route remains at `/api/auth/[...nextauth]` with Prisma adapter support. It is separate from the Clerk flow and is not used by the current login and registration pages; treat it as legacy until intentionally consolidated.

## Development

- npm
- ESLint with the Next.js core web vitals and TypeScript configurations
- Prisma CLI and `tsx` for database scripts

See `package.json` for the authoritative dependency list and scripts.
