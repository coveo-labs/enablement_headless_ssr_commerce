"use server";

import { Product, CartInitialState } from "@coveo/headless-react/ssr-commerce";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

// This file provides mock server-side actions for managing a shopping cart.
// It uses cookies to store cart items and provides functions to manipulate the cart.
// In a real application, these function would interact with persistent storage, like a database, or a PIM system.

export type CartItem = {
  product: SimplifiedProductForCookieStorage;
  quantity: number;
};

type SimplifiedProductForCookieStorage = {
  ec_product_id: string;
  ec_name: string;
  ec_price: number;
  ec_images: string[];
};

export type SuccessfulCheckout = {
  success: true;
  transactionId: string;
  revenue: number;
};

export type FailedCheckout = {
  success: false;
  message: string;
};

export type CheckoutResult = SuccessfulCheckout | FailedCheckout;

async function getCartFromCookies(): Promise<CartItem[]> {
  try {
    const cartCookie = cookies().get("cart");

    if (!cartCookie) return [];

    return JSON.parse(cartCookie.value) as CartItem[];
  } catch (error) {
    console.error("Failed to parse cart cookie:", error);
    return [];
  }
}

async function setCartInCookies(cart: CartItem[]) {
  try {
    const serialized = JSON.stringify(cart);

    cookies().set({
      name: "cart",
      value: serialized,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
    });
  } catch (error) {
    console.error("Error setting cart cookie:", error);
  }
}

export async function getCartItems(): Promise<CartItem[]> {
  return getCartFromCookies();
}

export async function addToCart(product: Product, quantity: number = 1): Promise<CartItem[]> {
  const cartItems = await getCartFromCookies();

  const existingItemIndex = cartItems.findIndex((item) => item.product.ec_product_id === product.ec_product_id);

  if (existingItemIndex >= 0) {
    cartItems[existingItemIndex].quantity += quantity;
  } else {
    const simplifiedProduct = {
      ec_product_id: product.ec_product_id!,
      ec_name: product.ec_name!,
      ec_price: product.ec_price!,
      ec_images: product.ec_images!,
    };
    cartItems.push({ product: simplifiedProduct, quantity });
  }

  await setCartInCookies(cartItems);
  return cartItems;
}

export async function removeFromCart(productId: string): Promise<CartItem[]> {
  const cartItems = await getCartFromCookies();

  const updatedCart = cartItems.filter((item) => item.product.ec_product_id !== productId);

  await setCartInCookies(updatedCart);
  return updatedCart;
}

export async function updateQuantity(productId: string, quantity: number): Promise<CartItem[]> {
  const cartItems = await getCartFromCookies();

  const itemIndex = cartItems.findIndex((item) => item.product.ec_product_id === productId);

  if (itemIndex >= 0 && quantity > 0) {
    cartItems[itemIndex].quantity = quantity;
  }

  await setCartInCookies(cartItems);
  return cartItems;
}

export async function getCartCount(): Promise<number> {
  const cartItems = await getCartFromCookies();
  return cartItems.reduce((total, item) => total + item.quantity, 0);
}

export async function getSubtotal(): Promise<number> {
  const cartItems = await getCartFromCookies();
  return cartItems.reduce((total, item) => total + Number(item.product.ec_price) * item.quantity, 0);
}

export async function getTaxes(): Promise<number> {
  const subtotal = await getSubtotal();
  return subtotal * 0.07; // Fixed 7% tax rate
}

export async function getTotalWithTax(): Promise<number> {
  const subtotal = await getSubtotal();
  const taxes = await getTaxes();
  return subtotal + taxes;
}

export async function clearCart(): Promise<CartItem[]> {
  await setCartInCookies([]);
  return [];
}

export async function getCartItemsWithMetadata(): Promise<CartInitialState["items"]> {
  const cartItems = await getCartFromCookies();

  return cartItems.map((item) => ({
    name: item.product.ec_name!,
    price: item.product.ec_price!,
    productId: item.product.ec_product_id!,
    quantity: item.quantity,
  }));
}

export async function checkout(): Promise<CheckoutResult> {
  const cartItems = await getCartFromCookies();

  if (cartItems.length === 0) {
    return {
      success: false,
      message: "Cart is empty",
    };
  }

  const transactionId = uuidv4();
  const revenue = await getTotalWithTax();

  await clearCart();

  return {
    success: true,
    transactionId,
    revenue,
  };
}
