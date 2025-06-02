"use client";

import { useProductView } from "@/lib/commerce-engine";
import { Product } from "@coveo/relay-event-types";
import { useEffect, useRef } from "react";

export default function ProductView(product: Product) {
  const productView = useProductView();
  const productViewEventEmitted = useRef(false);

  useEffect(() => {
    if (productViewEventEmitted.current) {
      return;
    }
    productView.methods?.view(product);
    productViewEventEmitted.current = true;
  }, [productView, product]);

  return null;
}
