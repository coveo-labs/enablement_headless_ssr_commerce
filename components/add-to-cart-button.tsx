"use client";

import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Product } from "@coveo/headless-react/ssr-commerce";
import { useMockedCartService } from "./providers/cart-provider";
import { useCart } from "@/lib/commerce-engine";

export interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart: mockAddToCartService } = useMockedCartService();
  const coveoHeadlessCart = useCart();

  const handleAddToCart = () => {
    mockAddToCartService(product);
    coveoHeadlessCart.methods?.updateItemQuantity({
      productId: product.ec_product_id!,
      name: product.ec_name!,
      price: product.ec_price!,
      quantity: 1,
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className="bg-gray-100 border border-gray-300 text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:shadow-md font-medium py-1 px-3 rounded-md transition-all duration-200 ease-in-out flex items-center cursor-pointer transform hover:scale-105"
    >
      <ShoppingCartIcon className="h-5 w-5 mr-1" />
      Add to Cart
    </button>
  );
}
