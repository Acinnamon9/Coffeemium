# Next.js E-commerce Application

This is a Next.js application, version `0.1.0`, leveraging Prisma as its ORM. It's built with TypeScript, Tailwind CSS, and ESLint for a modern development workflow, aiming to provide a robust e-commerce platform for coffee products.

## Key Features

*   **Product Catalog**: Displays a variety of coffee products with details like name, base price, description, image, and available roast options.
*   **Dynamic Routing**: Handles product and origin-specific pages dynamically, allowing for rich content experiences.
*   **Shopping Cart**: Robust functionality for adding products to a cart, managing quantities, and storing prices at the time of addition (because market fluctuations are a thing, even for coffee).
*   **Filtering & Search**: Client-side filtering and search capabilities on the shop page, ensuring an interactive and snappy user experience without constant server roundtrips.
*   **Landing Page**: A marketing-focused landing page showcasing featured coffees, explaining the "how it works" process, displaying customer testimonials, and a compelling call to action.
*   **User Interface**: Built with a modular component architecture using Radix UI primitives and expertly styled with Tailwind CSS for a sleek and responsive design.

## Technology Stack

*   **Framework**: Next.js (v16.0.1) – The full-stack React framework that keeps our server and client in delightful harmony.
*   **ORM**: Prisma (v6.19.0) with PostgreSQL – Our chosen database whisperer, making database interactions feel less like a chore and more like a conversation.
*   **Language**: TypeScript (v5) – Because who doesn't love a bit of type safety to catch those pesky errors before they even think about running?
*   **Styling**: Tailwind CSS (v4) – Utility-first CSS framework that lets us build beautiful designs directly in our markup, minimizing context switching.
*   **Linting**: ESLint (v9.39.0) with Prettier – Keeping our code clean, consistent, and undeniably aesthetically pleasing.
*   **UI Primitives**: Radix UI – Unstyled, accessible component primitives for building high-quality design systems.

## Application Structure

*   `app/`: The heart of our Next.js application, containing all the pages and routing logic. This includes the homepage (`/`), the main shop (`/shop`), individual product pages (`/products/[productId]`), origin-specific pages (`/origins/[slug]`), and user-centric routes like `/account`, `/admin`, `/login`, and `/register`.
*   `components/`: Our treasure trove of reusable UI components, neatly categorized:
    *   `landing/`: Components specifically crafted for the marketing-heavy landing page.
    *   `shop/`: Components dedicated to the e-commerce shop interface, handling product display, search, and client-side interactions.
    *   `ui/`: Generic, unstyled UI primitives, likely built on Radix UI, ready for Tailwind CSS magic.
*   `lib/`: The utility belt of the application, housing general utility functions (`utils.ts`), static data (e.g., `how-it-works-data.ts` and `origin-data.ts`), and our centralized Prisma client instance (`prisma.ts`).
*   `prisma/`: Where our database schema (`schema.prisma`) resides, defining the data models and their intricate relationships.
*   `public/`: The public face of our assets, primarily containing images (like those beautiful coffee shots, the company logo, and illustrations for the "how it works" section).

## Database Schema Highlights

The `prisma/schema.prisma` file orchestrates our data with the following key models:

*   **`Product`**: The core entity for our coffee offerings, encompassing details like name, base price, description, image, and intelligent relations to `Roast` and `ProductDetail` models.
*   **`Roast`**: Defines various coffee roast types and their unique properties, including a `defaultMultiplier` for nuanced pricing.
*   **`GrindOption`**: Lists the available grind choices (e.g., "whole bean," "espresso grind"), each with an associated `extraCost`.
*   **`ProductRoast`**: A clever join table facilitating the many-to-many relationship between products and their available roasts, allowing for product-specific `roastMultiplier` adjustments.
*   **`ProductDetail`**: Dedicated to providing extended, in-depth descriptions for products, offering more narrative space than the main `Product` description.
*   **`Cart`** and **`CartItem`**: Models meticulously designed for managing user shopping carts, including the precise `priceAtAddition` for each item, ensuring historical accuracy.

## Scripts

To get this digital caffeine fix up and running:

*   `dev`: Kicks off the development server, perfect for local tinkering and hot reloads.
    ```bash
    npm run dev
    ```
*   `build`: Generates the Prisma client and builds the Next.js application for production.
    ```bash
    npm run build
    ```
*   `start`: Launches the Next.js production server, ready to serve coffee to the masses.
    ```bash
    npm run start
    ```
*   `lint`: Runs ESLint for rigorous code quality checks, ensuring our codebase remains pristine.
    ```bash
    npm run lint
    ```
*   `postinstall`: Automatically runs `prisma generate` after `npm install`, ensuring our Prisma client is always in sync with the schema.

## Next.js Configuration

Our `next.config.ts` file currently employs the default Next.js configuration. This means we're playing it straight, with no explicit custom configurations for things like image optimization, internationalization, or other advanced features. For now, simplicity reigns supreme.
