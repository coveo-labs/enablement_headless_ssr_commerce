// Client Component: Displays popular/recently viewed product recommendations

"use client";

import { usePopularViewedHome } from "@/lib/commerce-engine";
import ProductButtonWithImage from "../product-button-with-image";

export default function PopularViewedHome() {
  // Get recommendation state and methods from Coveo engine
  const { state, methods } = usePopularViewedHome();

  return (
    <>
      <ul>
        <h3 className="headline">Recently Viewed Products</h3>
        {/* Render each recommended product */}
        {state.products.map((product) => (
          <li key={product.ec_product_id}>
            <ProductButtonWithImage methods={methods} product={product} />
          </li>
        ))}
      </ul>
    </>
  );
}
