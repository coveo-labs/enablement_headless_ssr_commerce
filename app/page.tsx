import { RecommendationProvider } from "@/components/providers/providers";
import PopularViewed from "@/components/recommendations/popular-viewed";
import { fetchCoveoStaticState } from "@/lib/fetch-coveo-static-state";
export default async function Home() {
  const { staticState, navigatorContext } = await fetchCoveoStaticState("recommendationEngineDefinition", {
    recommendationsSlots: ["popularViewedHome"],
  });

  return (
    <div>
      <h2>Welcome to our commerce store </h2>
      <RecommendationProvider staticState={staticState} navigatorContext={navigatorContext.marshal}>
        <PopularViewed />
      </RecommendationProvider>
    </div>
  );
}

export const dynamic = "force-dynamic";
