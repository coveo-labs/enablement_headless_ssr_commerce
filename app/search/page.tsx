import ProductList from "@/components/product-list";
import { SearchProvider } from "@/components/providers/providers";
import FacetGenerator from "@/components/facets/facet-generator";
import { searchEngineDefinition } from "@/lib/commerce-engine";
import { NextJsNavigatorContext } from "@/lib/navigatorContextProvider";
import { defaultContext } from "@/utils/context";
import { buildParameterSerializer, CartInitialState } from "@coveo/headless-react/ssr-commerce";
import ParameterManager from "@/components/parameter-manager";
import { headers } from "next/headers";

export default async function Search({ searchParams }: { searchParams: Promise<URLSearchParams> }) {
  // Sets the navigator context provider to use the newly created `navigatorContext` before fetching the app static state
  const navigatorContext = new NextJsNavigatorContext(headers());
  searchEngineDefinition.setNavigatorContextProvider(() => navigatorContext);

  const { deserialize } = buildParameterSerializer();
  const parameters = deserialize(await searchParams);

  // Fetches the cart items from an external service
  const items: CartInitialState["items"] = [];

  // Fetches the static state of the app with initial state (when applicable)
  const staticState = await searchEngineDefinition.fetchStaticState({
    controllers: {
      cart: { initialState: { items } },
      context: {
        language: defaultContext.language,
        country: defaultContext.country,
        currency: defaultContext.currency,
        view: {
          url: "https://sports.barca.group/search",
        },
      },
      parameterManager: { initialState: { parameters } },
    },
  });

  return (
    <SearchProvider staticState={staticState} navigatorContext={navigatorContext.marshal}>
      <ParameterManager url={navigatorContext.location} />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 order-1 lg:order-1">
            <FacetGenerator />
          </div>
          <div className="lg:col-span-3 order-2 lg:order-2">
            <ProductList />
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}

export const dynamic = "force-dynamic";
