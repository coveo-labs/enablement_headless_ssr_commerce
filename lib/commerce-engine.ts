// lib/commerce-engine.ts

import { defineCommerceEngine } from "@coveo/headless-react/ssr-commerce";
import engineConfig from "./commerce-engine-config";

export const engineDefinition = defineCommerceEngine(engineConfig);

export const {
  listingEngineDefinition,
  searchEngineDefinition,
  recommendationEngineDefinition,
  standaloneEngineDefinition,
} = engineDefinition;

export const allEngineDefinitions = {
  recommendationEngineDefinition,
  listingEngineDefinition,
  searchEngineDefinition,
  standaloneEngineDefinition,
};

export type AvailableCommerceEngineDefinitions = keyof typeof allEngineDefinitions;
export type AvailableRecommendationsSlots = ["popularViewedHome"];
export type AvailableStaticState<Definition extends AvailableCommerceEngineDefinitions> =
  ReturnType<(typeof engineDefinition)[Definition]["fetchStaticState"]> extends Promise<infer R> ? R : never;

export const {
  useCart,
  useContext,
  useSummary,
  useStandaloneSearchBox,
  useProductList,
  useInstantProducts,
  useSearchBox,
  useParameterManager,
  useFacetGenerator,
  useSort,
  usePagination,
  useProductView,
} = engineDefinition.controllers;
