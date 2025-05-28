import Link from "next/link";
import "./globals.css";
import { StandaloneProvider } from "@/components/providers/providers";
import SearchBox from "@/components/search-box";
import { NextJsNavigatorContext } from "@/lib/navigatorContextProvider";
import { headers } from "next/headers";
import { standaloneEngineDefinition } from "@/lib/commerce-engine";
import { CartInitialState } from "@coveo/headless-react/ssr-commerce";
import { defaultContext } from "@/utils/context";
import StandaloneSearchBox from "@/components/standalone-search-box";

export const metadata = {
  title: "Headless SSR examples",
  description: "Examples of using @coveo/headless-react/ssr-commerce",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
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
          url: `https://sports.barca.group/`,
        },
      },
    },
  });

  return (
    <html lang="en">
      <body className="app-body">
        <header className="sticky top-0 z-50 bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-blue-600 font-bold text-xl hover:text-blue-800 transition-colors"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-blue-600"
                  >
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor" />
                  </svg>
                  <span>Coveo Commerce</span>
                </Link>
              </div>

              <nav className="hidden md:flex items-center space-x-8">
                <Link
                  href="/surf-accessories"
                  className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
                >
                  Surf Accessories
                </Link>
                <Link
                  href="/paddleboards"
                  className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
                >
                  Paddleboards
                </Link>
                <Link
                  href="/toys"
                  className="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-200"
                >
                  Toys
                </Link>
              </nav>

              <div className="flex-1 max-w-md mx-4">
                <div className="bg-white rounded-lg p-1 transition-all duration-200">
                  <StandaloneProvider staticState={staticState} navigatorContext={navigatorContext.marshal}>
                    <SearchBox />
                  </StandaloneProvider>
                </div>
              </div>

              <div className="flex items-center justify-end w-20">
                {/* Space for potential future actions like cart, profile, etc. */}
              </div>
            </div>
          </div>
        </header>
        <div className="p-8">{children}</div>
      </body>
    </html>
  );
}
