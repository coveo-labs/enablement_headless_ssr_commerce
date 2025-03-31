// lib/commerce-engine.ts

import {defineCommerceEngine} from '@coveo/headless-react/ssr-commerce';
import engineConfig from './commerce-engine-config';

export const engineDefinition = defineCommerceEngine(engineConfig); 

export const {
  listingEngineDefinition, 
  searchEngineDefinition,
  recommendationEngineDefinition,
  standaloneEngineDefinition,
  useEngine, 
} = engineDefinition;

export const {
  useCart,
  useContext,
  useSummary,
  useStandaloneSearchBox,
  useProductList,
  useInstantProducts,
  useSearchBox,
  useParameterManager,
  usePopularViewedHome,
  useFacetGenerator,
} = engineDefinition.controllers; 