"use client";

import { Product } from "@coveo/headless-react/ssr-commerce";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  CartItem,
  CheckoutResult,
  addToCart as serverAddToCart,
  removeFromCart as serverRemoveFromCart,
  updateQuantity as serverUpdateQuantity,
  clearCart as serverClearCart,
  checkout as serverCheckout,
  getCartItems as serverGetCartItems,
  getCartCount as serverGetCartCount,
  getSubtotal as serverGetSubtotal,
  getTaxes as serverGetTaxes,
  getTotalWithTax as serverGetTotalWithTax,
} from "@/lib/cart-actions";

// This file provides a mock server context for managing cart operations.
// It simulates server-side cart actions and provides a context for components to use.
// In a real application, these functions would interact with a backend server with persistent storage.

interface MockServerCartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<CheckoutResult>;
  cartCount: number;
  subtotal: number;
  taxes: number;
  totalWithTax: number;
  isLoading: boolean;
}

const MockServerCartContext = createContext<MockServerCartContextType>({
  cartItems: [],
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
  checkout: async () => ({ success: false, message: "Not implemented" }),
  cartCount: 0,
  subtotal: 0,
  taxes: 0,
  totalWithTax: 0,
  isLoading: false,
});

export const useMockServerCartService = () => useContext(MockServerCartContext);

interface MockServerCartProviderProps {
  children: ReactNode;
}

export function MockServerCartProvider({ children }: MockServerCartProviderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [totalWithTax, setTotalWithTax] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCartData = async (setLoadingComplete = true) => {
    try {
      const items = await serverGetCartItems();
      const count = await serverGetCartCount();
      const sub = await serverGetSubtotal();
      const tax = await serverGetTaxes();
      const total = await serverGetTotalWithTax();

      setCartItems(items);
      setCartCount(count);
      setSubtotal(sub);
      setTaxes(tax);
      setTotalWithTax(total);
    } catch (error) {
      console.error("Failed to fetch cart data:", error);
    } finally {
      if (setLoadingComplete) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchCartData();
  }, []);

  const updateCartData = () => fetchCartData(false);

  const addToCart = async (product: Product, quantity: number = 1) => {
    setIsLoading(true);
    try {
      await serverAddToCart(product, quantity);
      await updateCartData();
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (productId: string) => {
    setIsLoading(true);
    try {
      await serverRemoveFromCart(productId);
      await updateCartData();
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    setIsLoading(true);
    try {
      await serverUpdateQuantity(productId, quantity);
      await updateCartData();
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      await serverClearCart();
      await updateCartData();
    } catch (error) {
      console.error("Failed to clear cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkout = async () => {
    setIsLoading(true);
    const result = await serverCheckout();
    await updateCartData();
    setIsLoading(false);
    return result;
  };

  return (
    <MockServerCartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        checkout,
        cartCount,
        subtotal,
        taxes,
        totalWithTax,
        isLoading,
      }}
    >
      {children}
    </MockServerCartContext.Provider>
  );
}
