import { RecommendationProvider } from "@/components/providers/providers";
import PopularViewed from "@/components/recommendations/popular-viewed";
import { fetchCoveoStaticState } from "@/lib/fetch-coveo-static-state";
export default async function Home() {


  return (
    <div>
      <h2>Welcome to our commerce store </h2>
        TODO: Implement a recommendation slot here 
    </div>
  );
}

export const dynamic = "force-dynamic";
