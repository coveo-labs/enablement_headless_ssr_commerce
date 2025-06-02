// lib/commerce-engine-config.ts
import {
  CommerceEngineDefinitionOptions,
  defineProductList,
  defineCart,
  defineSearchBox,
  defineContext,
  defineSummary,
  defineStandaloneSearchBox,
  defineInstantProducts,
  getSampleCommerceEngineConfiguration,
  defineParameterManager,
  defineRecommendations,
  defineFacetGenerator,
  defineSort,
  definePagination,
  defineProductView,
} from "@coveo/headless-react/ssr-commerce";

export default {
  configuration: {
    ...getSampleCommerceEngineConfiguration(),
  },
  controllers: {
    cart: defineCart(),
    context: defineContext(),
    summary: defineSummary(),
    productList: defineProductList(),
    searchBox: defineSearchBox(),
    standaloneSearchBox: defineStandaloneSearchBox({
      options: { redirectionUrl: "/search" },
    }),
    popularViewedHome: defineRecommendations({
      options: {
        slotId: "d73afbd2-8521-4ee6-a9b8-31f064721e73",
      },
    }),
    instantProducts: defineInstantProducts(),
    parameterManager: defineParameterManager(),
    facetGenerator: defineFacetGenerator(),
    sort: defineSort(),
    pagination: definePagination(),
    productView: defineProductView(),
  },
} satisfies CommerceEngineDefinitionOptions;
