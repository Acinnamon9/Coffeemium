# Tech Stack

## Core Framework & Language

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Library**: [React 19](https://react.dev/)

## Styling & UI Components

- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Component Library**: [shadcn/ui](https://ui.shadcn.com/) (built on Radix UI primitives)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes) (Dark mode support)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## Backend & Database

- **Database**: PostgreSQL
- **Serverless Provider**: [Neon](https://neon.tech/) (`@neondatabase/serverless`)
- **ORM**: [Prisma](https://www.prisma.io/) (`@prisma/client`, `@prisma/adapter-pg`)
  - _Includes Prisma Accelerate for connection pooling/caching_

## Authentication

- **Primary**: [Clerk](https://clerk.com/) (`@clerk/nextjs`)
- **Secondary/Legacy**: [NextAuth.js](https://next-auth.js.org/) (`next-auth`, `@auth/prisma-adapter`)
  - _Note: Check if NextAuth is still actively used since Clerk is present._

## Data & State Management

- **Validation**: [Zod](https://zod.dev/)
- **Data Fetching**: [SWR](https://swr.vercel.app/)

## Tools & DevOps

- **Linting**: ESLint + Prettier
- **Package Manager**: npm
