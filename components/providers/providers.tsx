"use client";

import { searchEngineDefinition, standaloneEngineDefinition } from "@/lib/commerce-engine";
import { buildProviderWithDefinition } from "@coveo/headless-react/ssr-commerce";
import { MockServerCartProvider } from "./server-cart-provider";

// Wraps listing pages to provide context for listing-specific hooks
//TODO: Implement listing engine definition and provider

// Wraps search pages to provide context for search-specific hooks
export const SearchProvider = buildProviderWithDefinition(searchEngineDefinition);

// Wraps recommendations, whether in a standalone, search, or listing page
// TODO: Implement recommendations engine definition and provider

export const StandaloneProvider = buildProviderWithDefinition(standaloneEngineDefinition);

// Export CartProvider for use in layout
// Use ServerCartProvider for server-side storage or MockedCartProvider for client-side storage
export { MockServerCartProvider };
