"use server";

import { headers } from "next/headers";
import { NextJsNavigatorContext } from "./navigator-context-provider";
import {
  AvailableCommerceEngineDefinitions,
  AvailableRecommendationsSlots,
  AvailableStaticState,
  engineDefinition,
} from "./commerce-engine";
import { getCartItemsWithMetadata } from "./cart-actions";
import { CommerceSearchParameters } from "@coveo/headless-react/ssr-commerce";
import { defaultContext } from "./commerce-engine-config";

const defaultFetchCoveoStaticStateOptions = {
  url: "https://sports.barca.group",
  urlParameters: {},
  recommendationsSlots: [],
} as const;

export async function fetchCoveoStaticState<Definition extends AvailableCommerceEngineDefinitions>(
  definition: Definition,
  options: {
    url?: string;
    urlParameters?: CommerceSearchParameters;
    recommendationsSlots?: AvailableRecommendationsSlots;
  } = {},
): Promise<{
  staticState: AvailableStaticState<Definition>;
  navigatorContext: NextJsNavigatorContext;
}> {
  const { recommendationsSlots, url, urlParameters } = {
    ...defaultFetchCoveoStaticStateOptions,
    ...options,
  };

  // Sets the navigator context provider to use the newly created `navigatorContext` before fetching the app static state
  const navigatorContext = new NextJsNavigatorContext(headers());

  // You can add another breakpoint here to debug the navigator context
  engineDefinition[definition].setNavigatorContextProvider(() => navigatorContext);

  // Fetches the cart items from the cart actions
  const items = await getCartItemsWithMetadata();

  // For recommendation engine definitions, we need to fetch the recommendations slots
  // This is done by creating an object with the slots as keys and setting them to enabled
  const recommendationsToFetch = recommendationsSlots.reduce(
    (acc, slot) => {
      acc[slot] = { enabled: true };
      return acc;
    },
    {} as Record<AvailableRecommendationsSlots[number], { enabled: boolean }>,
  );

  // Fetches the static state of the app with initial state (when applicable)
  const staticState = await engineDefinition[definition].fetchStaticState({
    controllers: {
      parameterManager: {
        initialState: {
          parameters: urlParameters,
        },
      },
      cart: { initialState: { items } },
      context: {
        ...defaultContext,
        view: {
          url,
        },
      },
      ...(definition === "recommendationEngineDefinition" && recommendationsToFetch),
    },
  });

  return {
    staticState: staticState as AvailableStaticState<Definition>,
    navigatorContext,
  };
}
