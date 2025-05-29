"use client";

import { Product } from "@coveo/headless-react/ssr-commerce";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem, CartService, CheckoutResult } from "@/lib/cart-service";
import { 
  serverAddToCart, 
  serverRemoveFromCart, 
  serverUpdateQuantity, 
  serverClearCart,
  serverGetCartItems,
  serverGetCartCount,
  serverGetSubtotal,
  serverGetTaxes,
  serverGetTotalWithTax,
  serverCheckout
} from "@/lib/cart-actions";

// This file provides a mocked cart context for use in the application.
// It simulates a shopping cart service

interface MockedCartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: () => CheckoutResult;
  cartCount: number;
  subtotal: number;
  taxes: number;
  totalWithTax: number;
}

const MockedCartContext = createContext<MockedCartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  checkout: () => ({ success: false, message: "Not implemented" }),
  cartCount: 0,
  subtotal: 0,
  taxes: 0,
  totalWithTax: 0,
});

export const useMockedCartService = () => useContext(MockedCartContext);

interface MockedCartProviderProps {
  children: ReactNode;
}

export function MockedCartProvider({ children }: MockedCartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setCartItems(CartService.getCartItems());
    setCartCount(CartService.getCartCount());
  }, []);

  const addToCart = (product: Product, quantity: number = 1) => {
    const updatedCart = CartService.addToCart(product, quantity);
    setCartItems(updatedCart);
    setCartCount(CartService.getCartCount());
  };

  const removeFromCart = (productId: string) => {
    const updatedCart = CartService.removeFromCart(productId);
    setCartItems(updatedCart);
    setCartCount(CartService.getCartCount());
  };

  const updateQuantity = (productId: string, quantity: number) => {
    const updatedCart = CartService.updateQuantity(productId, quantity);
    setCartItems(updatedCart);
    setCartCount(CartService.getCartCount());
  };

  const clearCart = () => {
    const updatedCart = CartService.clearCart();
    setCartItems(updatedCart);
    setCartCount(0);
  };

  return (
    <MockedCartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout: CartService.checkout,
        cartCount,
        subtotal: CartService.getSubtotal(),
        taxes: CartService.getTaxes(),
        totalWithTax: CartService.getTotalWithTax(),
      }}
    >
      {children}
    </MockedCartContext.Provider>
  );
}
