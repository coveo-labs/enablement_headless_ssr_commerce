import { fetchCoveoStaticState } from "@/lib/fetch-coveo-static-state";
import { RecommendationProvider } from "@/components/providers/providers";
import PopularViewedHome from "@/components/recommendations/popular-viewed";
export default async function Home() {
  const { staticState, navigatorContext } = await fetchCoveoStaticState("recommendationEngineDefinition", {
    url: "https://sports.barca.group",
    recommendationsSlots: ["popularViewedHome"],
  });
  return (
    <RecommendationProvider staticState={staticState} navigatorContext={navigatorContext.marshal}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Barca Store</h1>
          <p className="text-lg text-gray-600">
            Product Recommendations
          </p>
        </div>
        
        <PopularViewedHome />
    </div>
    </RecommendationProvider>
  );
}

export const dynamic = "force-dynamic";
