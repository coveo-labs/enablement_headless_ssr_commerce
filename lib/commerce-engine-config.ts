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
  defineParameterManager,
  defineFacetGenerator,
  defineSort,
  definePagination,
  defineProductView,
  ContextState,
} from "@coveo/headless-react/ssr-commerce";

export const defaultContext: {
  language: string;
  country: string;
  currency: ContextState["currency"];
} = {
  language: "en",
  country: "US",
  currency: "USD",
};

export default {
  configuration: {
    organizationId: "xxx",
    accessToken: "xxx",
    context: {
      ...defaultContext,
      view: {
        url: "https://sports.barca.group",
      },
    },
    analytics: {
      trackingId: "xxx",
    },
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
    instantProducts: defineInstantProducts(),
    parameterManager: defineParameterManager(),
    facetGenerator: defineFacetGenerator(),
    sort: defineSort(),
    pagination: definePagination(),
    productView: defineProductView(),
  },
} satisfies CommerceEngineDefinitionOptions;
