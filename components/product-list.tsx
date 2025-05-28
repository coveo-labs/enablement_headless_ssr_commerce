"use client";

import { useProductList } from "@/lib/commerce-engine";
import ProductButtonWithImage from "./product-button-with-image";

export default function ProductList() {
  const { state, methods } = useProductList();

  return (
    <>
      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" aria-label="Product List">
        {state.products.map((product) => (
          <ProductButtonWithImage methods={methods} product={product} key={product.permanentid} />
        ))}
      </div>
    </>
  );
}
