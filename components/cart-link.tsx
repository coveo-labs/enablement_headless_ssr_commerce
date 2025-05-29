"use client";

import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useMockedCartService } from "./providers/cart-provider";

export default function CartLink() {
  const { cartCount } = useMockedCartService();

  return (
    <Link href="/cart" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 relative">
      <span className="sr-only">Shopping Cart</span>
      <ShoppingCartIcon className="w-6 h-6" />
      <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        {cartCount}
      </span>
    </Link>
  );
}
