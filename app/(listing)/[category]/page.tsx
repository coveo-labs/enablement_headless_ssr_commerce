import ParameterManager from "@/components/parameter-manager";
import ProductList from "@/components/product-list";
import { ListingProvider } from "@/components/providers/providers";
import { listingEngineDefinition } from "@/lib/commerce-engine";
import { NextJsNavigatorContext } from "@/lib/navigatorContextProvider";
import { defaultContext } from "@/utils/context";
import { buildParameterSerializer, CartInitialState } from "@coveo/headless-react/ssr-commerce";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

// This is a hardcoded list of categories that are available in my coveo merchandising hub.
const categoryList = ["surf-accessories", "paddleboards", "toys"];
/**
 * This file defines a List component that uses the Coveo Headless SSR commerce library to manage its state.
 *
 * The Listing function is the entry point for server-side rendering (SSR).
 */
export default async function Listing({
  params,
  searchParams,
}: {
  params: { category: string };
  searchParams: Promise<URLSearchParams>;
}) {
  const { category } = params;

  const matchedCategory = categoryList.find((c) => c === category);

  if (!matchedCategory) {
    notFound();
  }

  // Sets the navigator context provider to use the newly created `navigatorContext` before fetching the app static state
  const navigatorContext = new NextJsNavigatorContext(headers());
  listingEngineDefinition.setNavigatorContextProvider(() => navigatorContext);

  const { deserialize } = buildParameterSerializer();
  const parameters = deserialize(await searchParams);

  // Fetches the cart items from an external service
  const items: CartInitialState["items"] = [];

  // Fetches the static state of the app with initial state (when applicable)
  const staticState = await listingEngineDefinition.fetchStaticState({
    controllers: {
      cart: { initialState: { items } },
      context: {
        language: defaultContext.language,
        country: defaultContext.country,
        currency: defaultContext.currency,
        view: {
          url: `https://sports.barca.group/browse/promotions/${matchedCategory}`,
        },
      },
      parameterManager: { initialState: { parameters } },
    },
  });

  return (
    <ListingProvider staticState={staticState} navigatorContext={navigatorContext.marshal}>
      <ParameterManager url={navigatorContext.location} />
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ flex: 2 }}>
          <ProductList />
        </div>
      </div>
    </ListingProvider>
  );
}

export const dynamic = "force-dynamic";
