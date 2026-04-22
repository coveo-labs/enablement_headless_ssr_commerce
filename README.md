# Next.js Coveo SSR Commerce (Training Project)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

> **Note:** This project is for training purposes.

## Table of Contents

- [Getting Started](#getting-started)
- [How Headless SSR Works](#how-headless-ssr-works)
- [Architecture Overview](#architecture-overview)
- [Key Components](#key-components)
- [Available Scripts](#available-scripts)
- [Tasks / TODOs](#tasks--todos)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/coveo-labs/enablement_headless_ssr_commerce.git
cd enablement_headless_ssr_commerce
```

### 2. Install dependencies

```bash
npm install
```

### 3. Build the project

```bash
npm run build
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How Headless SSR Works

### What is Headless SSR?

**Server-Side Rendering (SSR)** with **Headless Commerce** combines the benefits of:

- **SEO optimization** - Search engines can crawl fully rendered pages
- **Fast initial page loads** - HTML is generated on the server
- **Dynamic content** - Powered by Coveo's headless commerce engine
- **Hydration** - Client-side interactivity after initial render

### The SSR Flow

```
1. User Request → Next.js Server
2. Server fetches static state from Coveo (fetchCoveoStaticState)
3. Server renders React components with data
4. HTML sent to browser (First Contentful Paint)
5. React hydrates on client (Interactive)
6. Subsequent interactions use client-side state
```

### Key Concepts

#### 1. **Engine Definitions**

The application uses multiple engine types for different purposes:

- **`standaloneEngineDefinition`** - For standalone search boxes (header search)
- **`searchEngineDefinition`** - For search result pages
- **`listingEngineDefinition`** - For product listing pages (categories)
- **`recommendationEngineDefinition`** - For product recommendations

Each engine is defined in `lib/commerce-engine-config.ts` with its controllers.

#### 2. **Static State Fetching**

The `fetchCoveoStaticState()` function (in `lib/fetch-coveo-static-state.ts`) is the heart of SSR:

```typescript
const { staticState, navigatorContext } = await fetchCoveoStaticState("searchEngineDefinition");
```

This function:

- Runs on the **server only** (marked with `"use server"`)
- Fetches initial data from Coveo APIs
- Captures navigator context (user agent, referrer, etc.)
- Returns serializable state for hydration

#### 3. **Providers Pattern**

Each engine type has a corresponding Provider component:

```typescript
// Server Component (layout.tsx or page.tsx)
const { staticState, navigatorContext } = await fetchCoveoStaticState("searchEngineDefinition");

// Client Component
<SearchProvider staticState={staticState} navigatorContext={navigatorContext.marshal}>
  <ProductList />
  <Facets />
</SearchProvider>
```

Providers:

- Wrap client components that need Coveo state
- Initialize the headless engine with server-fetched state
- Enable hooks like `useProductList()`, `useFacetGenerator()`

#### 4. **Controllers**

Controllers are defined in the engine configuration and provide specific functionality:

- **`cart`** - Shopping cart management
- **`productList`** - Product search/listing results
- **`searchBox`** - Search input and suggestions
- **`facetGenerator`** - Dynamic facet generation
- **`sort`** - Sorting options
- **`pagination`** - Page navigation
- **`context`** - User context (language, currency, country)
- **`summary`** - Result count and query information

Each controller has a corresponding React hook (e.g., `useProductList()`, `useCart()`).

## Architecture Overview

### File Structure

```
lib/
├── commerce-engine-config.ts    # Engine configuration & controller definitions
├── commerce-engine.ts           # Engine definition & hook exports
├── fetch-coveo-static-state.ts  # Server-side state fetching
├── navigator-context-provider.ts # Browser context for SSR
└── cart-actions.ts              # Server actions for cart

components/
├── providers/
│   ├── providers.tsx            # Client-side provider components
│   └── server-cart-provider.tsx # Cart state management
├── cart/                        # Cart-related components
├── facets/                      # Facet components
└── recommendations/             # Recommendation components

app/
├── layout.tsx                   # Root layout with header & search
├── page.tsx                     # Homepage
├── search/page.tsx              # Search results page
├── paddleboards/page.tsx        # Category listing page
└── product/page.tsx             # Product detail page
```

### Data Flow

#### Server-Side (Initial Render)

```
1. Next.js receives request
2. Page component calls fetchCoveoStaticState()
3. Coveo API returns search results/products
4. React renders components with data
5. HTML + serialized state sent to browser
```

#### Client-Side (Hydration & Interaction)

```
1. Browser receives HTML
2. React hydrates with staticState
3. Provider initializes headless engine
4. User interactions update state
5. Components re-render with new data
```

### Example: Search Page Flow

**Server Component** (`app/search/page.tsx`):

```typescript
export default async function SearchPage({ searchParams }) {
  // Fetch static state on server
  const { staticState, navigatorContext } = await fetchCoveoStaticState(
    "searchEngineDefinition",
    { urlParameters: searchParams }
  );

  return (
    <SearchProvider staticState={staticState} navigatorContext={navigatorContext.marshal}>
      <ProductList />
      <FacetGenerator />
    </SearchProvider>
  );
}
```

**Client Component** (`components/product-list.tsx`):

```typescript
"use client";

export default function ProductList() {
  const { state } = useProductList();

  return (
    <div>
      {state.products.map(product => (
        <ProductCard key={product.permanentid} product={product} />
      ))}
    </div>
  );
}
```

## Key Components

### 1. Engine Configuration (`lib/commerce-engine-config.ts`)

- Defines organization ID, access token, tracking ID
- Configures default context (language, country, currency)
- Declares all controllers used in the application

### 2. Static State Fetcher (`lib/fetch-coveo-static-state.ts`)

- Server-side function to fetch initial state
- Handles navigator context for analytics
- Supports different engine types and parameters

### 3. Providers (`components/providers/providers.tsx`)

- Client-side wrappers for Coveo engines
- Enable React hooks in child components
- Manage state hydration and updates

### 4. Cart Management (`lib/cart-actions.ts`)

- Server actions for cart operations
- Persistent storage using cookies
- Metadata enrichment from Coveo

### 5. Facets (`components/facets/`)

- Dynamic facet generation
- Category, regular, and numeric facets
- Search within facets functionality

## Available Scripts

- `npm run dev` – Start the development server.
- `npm run build` – Build the application for production.
- `npm run start` – Start the production server.
- `npm run lint` – Run ESLint.
- `npm run format` – Format code using Prettier.

## Tasks / TODOs

- [ ] Replace placeholder values (`organizationId`, `accessToken`, `trackingId`) in [`lib/commerce-engine-config.ts`](lib/commerce-engine-config.ts) with real credentials.
- [ ] Review and update the commerce engine configuration as needed for your use case.
- [ ] Implement the recommendations engine definition and provider in [`components/providers/providers.tsx`](components/providers/providers.tsx).
- [ ] Add a recommendation carousel to the homepage.
- [ ] Implement the listing engine definition and provider in [`components/providers/providers.tsx`](components/providers/providers.tsx).
- [ ] Create a new page at [`app/listing`](app/listing) to display product listings.
- [ ] Implement additional features or controllers as required for your training objectives.

> Check the code for further TODO comments and update this list as you progress.

