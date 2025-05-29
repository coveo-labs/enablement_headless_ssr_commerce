// components/providers/providers.tsx

"use client";

import {
  searchEngineDefinition,
  standaloneEngineDefinition,
  listingEngineDefinition,
  recommendationEngineDefinition,
} from "@/lib/commerce-engine";
import { buildProviderWithDefinition } from "@coveo/headless-react/ssr-commerce";
import { MockedCartProvider } from "./cart-provider";

// Wraps listing pages to provide context for listing-specific hooks
export const ListingProvider = buildProviderWithDefinition(listingEngineDefinition);

// Wraps search pages to provide context for search-specific hooks
export const SearchProvider = buildProviderWithDefinition(searchEngineDefinition);

// Wraps recommendations, whether in a standalone, search, or listing page
export const RecommendationProvider = buildProviderWithDefinition(recommendationEngineDefinition);

export const StandaloneProvider = buildProviderWithDefinition(standaloneEngineDefinition);

// Export CartProvider for use in layout
export { MockedCartProvider };
