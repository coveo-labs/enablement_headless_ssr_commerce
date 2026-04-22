import ProductList from "@/components/product-list";
import { SearchProvider } from "@/components/providers/providers";
import FacetGenerator from "@/components/facets/facet-generator";
import { buildParameterSerializer } from "@coveo/headless-react/ssr-commerce";
import ParameterManager from "@/components/parameter-manager";
import Sort from "@/components/sort";
import Pagination from "@/components/pagination";
import { fetchCoveoStaticState } from "@/lib/fetch-coveo-static-state";

// Server Component: Displays all products with search functionality
export default async function Search({ searchParams }: { searchParams: Promise<URLSearchParams> }) {
  // Convert URL parameters to Coveo format
  const { deserialize } = buildParameterSerializer();
  const urlParameters = deserialize(await searchParams);

  // Fetch static state from Coveo on server (SSR)
  const { staticState, navigatorContext } = await fetchCoveoStaticState("searchEngineDefinition", {
    urlParameters,
    url: "https://sports.barca.group/search",
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
            <div className="flex justify-end mb-4">
              <Sort />
            </div>
            <ProductList />
            <div className="flex justify-end mt-6">
              <Pagination />
            </div>
          </div>
        </div>
      </div>
    </SearchProvider>
  );
}

export const dynamic = "force-dynamic";
