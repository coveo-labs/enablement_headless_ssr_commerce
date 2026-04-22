/* eslint-disable prettier/prettier */
import FacetGenerator from "@/components/facets/facet-generator";
import Pagination from "@/components/pagination";
import ParameterManager from "@/components/parameter-manager";
import ProductList from "@/components/product-list";
import { ListingProvider } from "@/components/providers/providers";
import { listingEngineDefinition } from "@/lib/commerce-engine";
import { NextJsNavigatorContext } from "@/lib/navigator-context-provider";

import { buildParameterSerializer } from "@coveo/headless-react/ssr-commerce";
import { headers } from "next/headers";

// Server Component: Surf Accessories category listing page
export default async function Listing({
  searchParams,
}: {
  params: { category: string };
  searchParams: Promise<URLSearchParams>;
}) {
  // Set up navigator context for analytics tracking
  const navigatorContext = new NextJsNavigatorContext(headers());
  listingEngineDefinition.setNavigatorContextProvider(() => navigatorContext);

  // Deserialize URL parameters (filters, sort, pagination)
  const { deserialize } = buildParameterSerializer();
  const parameters = deserialize(await searchParams);

  // Fetch static state from Coveo listing engine (SSR)
  const staticState = await listingEngineDefinition.fetchStaticState({
    controllers: {
      cart: { initialState: {} },
      context: {
        language: "en",
        country: "CA",
        currency: "CAD",
        view: {
          url: `https://sports.barca.group/surf-accessories`,
        },
      },
      parameterManager: { initialState: { parameters } },
    },
  });

  return (
    <ListingProvider staticState={staticState} navigatorContext={navigatorContext.marshal}>
            
      <ParameterManager url={navigatorContext.location} />
            
      <div style={{ display: "flex", flexDirection: "row" }}>
                
        <div style={{ flex: 1 }}>
                    
          <FacetGenerator />
                  
        </div>
                
        <div style={{ flex: 2 }}>
                    
          <ProductList />
                    
          <Pagination />
                  
        </div>
              
      </div>
          
    </ListingProvider>
  );
}

export const dynamic = "force-dynamic";
