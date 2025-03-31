import ProductList from '@/components/product-list';
import {SearchProvider} from '@/components/providers/providers';
import FacetGenerator from '@/components/facets/facet-generator';
import SearchBox from '@/components/search-box';
import {searchEngineDefinition} from '@/lib/commerce-engine';
import {NextJsNavigatorContext} from '@/lib/navigatorContextProvider';
import {defaultContext} from '@/utils/context';
import {buildParameterSerializer} from '@coveo/headless-react/ssr-commerce';
import ParameterManager from '@/components/parameter-manager';
import {headers} from 'next/headers';

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<URLSearchParams>;
}) {
  // Sets the navigator context provider to use the newly created `navigatorContext` before fetching the app static state
  const navigatorContext = new NextJsNavigatorContext(headers());
  searchEngineDefinition.setNavigatorContextProvider(() => navigatorContext);

  const {deserialize} = buildParameterSerializer();
  const parameters = deserialize(await searchParams);

  // Fetches the cart items from an external service
  const items: any[] = [];

  // Fetches the static state of the app with initial state (when applicable)
  const staticState = await searchEngineDefinition.fetchStaticState({
    controllers: {
      cart: {initialState: {items}},
      context: {
        language: defaultContext.language,
        country: defaultContext.country,
        currency: defaultContext.currency,
        view: {
          url: 'https://sports.barca.group/search',
        },
      },
      parameterManager: {initialState: {parameters}},
    },
  });

  return (
    <SearchProvider
      staticState={staticState}
      navigatorContext={navigatorContext.marshal}
    >
      <ParameterManager url={navigatorContext.location} />
      {/* Moved SearchBox out of the grid */}
      <SearchBox />
      <div className="search-container">
        <div className="facet-container">
          <FacetGenerator />
        </div>
        <div className="product-container">
          <ProductList />
        </div>
      </div>
    </SearchProvider>
  );
}

export const dynamic = 'force-dynamic';
