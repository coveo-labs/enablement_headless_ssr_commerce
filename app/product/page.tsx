import { StandaloneProvider } from "@/components/providers/providers";
import StandaloneSearchBox from "@/components/standalone-search-box";
import { standaloneEngineDefinition } from "@/lib/commerce-engine";
import { NextJsNavigatorContext } from "@/lib/navigatorContextProvider";
import { defaultContext } from "@/utils/context";
import { CartInitialState } from "@coveo/headless-react/ssr-commerce";
import { headers } from "next/headers";

export default async function Home() {
  // Sets the navigator context provider to use the newly created `navigatorContext` before fetching the app static state
  const navigatorContext = new NextJsNavigatorContext(headers());
  standaloneEngineDefinition.setNavigatorContextProvider(() => navigatorContext);

  // Fetches the cart items from an external service
  const items: CartInitialState["items"] = [];

  // Fetches the static state of the app with initial state (when applicable)
  const staticState = await standaloneEngineDefinition.fetchStaticState({
    controllers: {
      cart: { initialState: { items } },
      context: {
        language: defaultContext.language,
        country: defaultContext.country,
        currency: defaultContext.currency,
        view: {
          url: `https://sports.barca.group/product/`,
        },
      },
    },
  });
  return (
    <div>
      <h2>Product Page </h2>
      <StandaloneProvider staticState={staticState} navigatorContext={navigatorContext.marshal}>
        <StandaloneSearchBox />
      </StandaloneProvider>
      <br />
      This is a potential product page.
    </div>
  );
}

export const dynamic = "force-dynamic";
