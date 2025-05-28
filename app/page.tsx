import { RecommendationProvider } from "@/components/providers/providers";
import PopularViewed from "@/components/recommendations/popular-viewed";
import { standaloneEngineDefinition, recommendationEngineDefinition } from "@/lib/commerce-engine";
import { NextJsNavigatorContext } from "@/lib/navigatorContextProvider";
import { defaultContext } from "@/utils/context";
import { headers } from "next/headers";
import { CartInitialState } from "@coveo/headless-react/ssr-commerce";

export default async function Home() {
  // Sets the navigator context provider to use the newly created `navigatorContext` before fetching the app static state
  const navigatorContext = new NextJsNavigatorContext(headers());
  standaloneEngineDefinition.setNavigatorContextProvider(() => navigatorContext);

  // Fetches the cart items from an external service
  const items: CartInitialState["items"] = [];

  const recsStaticState = await recommendationEngineDefinition.fetchStaticState({
    controllers: {
      popularViewedHome: { enabled: true },
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
    <div>
      <h2>Welcome to our commerce store </h2>
      <RecommendationProvider staticState={recsStaticState} navigatorContext={navigatorContext.marshal}>
        <PopularViewed />
      </RecommendationProvider>
    </div>
  );
}

export const dynamic = "force-dynamic";
