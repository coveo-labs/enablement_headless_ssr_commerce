"use client";

import { useMockedCartService } from "./providers/cart-provider";

export default function CartCount() {
  const { cartCount } = useMockedCartService();

  return (
    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      {cartCount}
    </span>
  );
}
