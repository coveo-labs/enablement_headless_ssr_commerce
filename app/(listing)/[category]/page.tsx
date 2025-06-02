import ParameterManager from "@/components/parameter-manager";
import ProductList from "@/components/product-list";
import { ListingProvider } from "@/components/providers/providers";
import { fetchCoveoStaticState } from "@/lib/fetch-coveo-static-state";
import { buildParameterSerializer } from "@coveo/headless-react/ssr-commerce";
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

  const { deserialize } = buildParameterSerializer();
  const parameters = deserialize(await searchParams);

  const { staticState, navigatorContext } = await fetchCoveoStaticState("listingEngineDefinition", {
    urlParameters: parameters,
    url: `https://sports.barca.group/browse/promotions/${matchedCategory}`,
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
