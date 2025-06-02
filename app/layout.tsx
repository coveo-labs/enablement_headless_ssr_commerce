import Link from "next/link";
import "./globals.css";
import { StandaloneProvider } from "@/components/providers/providers";
import SearchBox from "@/components/search-box";
import CartLink from "@/components/cart/cart-link";
import Image from "next/image";
import { fetchCoveoStaticState } from "@/lib/fetch-coveo-static-state";
import { MockServerCartProvider } from "@/components/providers/providers";

export const metadata = {
  title: "Headless SSR examples",
  description: "Examples of using @coveo/headless-react/ssr-commerce",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { staticState, navigatorContext } = await fetchCoveoStaticState("standaloneEngineDefinition");

  return (
    <html lang="en">
      <body className="app-body">
        <MockServerCartProvider>
          <header className="sticky top-0 z-50 bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-blue-600 font-bold text-xl hover:text-blue-800 transition-colors"
                  >
                    <Image
                      src="/Coveo_Horizontal_Blue.svg"
                      alt="Coveo Logo"
                      width={120}
                      height={30}
                      className="h-8 w-auto"
                    />
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
                  <CartLink />
                </div>
              </div>
            </div>
          </header>
          <div className="p-8">{children}</div>
        </MockServerCartProvider>
      </body>
    </html>
  );
}
