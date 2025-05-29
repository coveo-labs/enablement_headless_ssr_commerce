import React from "react";
import Cart from "@/components/cart/cart";
import { RecommendationProvider } from "@/components/providers/providers";
import { NextJsNavigatorContext } from "@/lib/navigatorContextProvider";
import { recommendationEngineDefinition } from "@/lib/commerce-engine";
import { defaultContext } from "@/utils/context";
import { CartService } from "@/lib/cart-service";
import { headers } from "next/headers";

export default async function CartPage() {
  const navigatorContext = new NextJsNavigatorContext(headers());
  recommendationEngineDefinition.setNavigatorContextProvider(() => navigatorContext);

  // Get cart items for the headless provider
  const items = CartService.getCartItemsWithMetadata();
  console.log("Cart items:", items);

  // Fetch the static state for the standalone provider
  const staticState = await recommendationEngineDefinition.fetchStaticState({
    controllers: {
      cart: { initialState: { items } },
      context: {
        language: defaultContext.language,
        country: defaultContext.country,
        currency: defaultContext.currency,
        view: {
          url: `https://sports.barca.group/cart`,
        },
      },
    },
  });

  return (
    <RecommendationProvider staticState={staticState} navigatorContext={navigatorContext.marshal}>
      <Cart />
    </RecommendationProvider>
  );
}
