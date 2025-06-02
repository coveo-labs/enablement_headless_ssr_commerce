import React from "react";
import { fetchCoveoStaticState } from "@/lib/fetch-coveo-static-state";
import { StandaloneProvider } from "@/components/providers/providers";
import Cart from "@/components/cart/cart";

export default async function CartPage() {
  const { staticState, navigatorContext } = await fetchCoveoStaticState("standaloneEngineDefinition");

  return (
    <StandaloneProvider staticState={staticState} navigatorContext={navigatorContext.marshal}>
      <Cart />
    </StandaloneProvider>
  );
}
