import { Product, CartInitialState } from "@coveo/headless-react/ssr-commerce";
import { v4 as uuidv4 } from "uuid";

// This is a mock implementation of a cart service for demo purposes only.
// It simulates adding, removing, and updating items in a shopping cart.
// In a real application, this would likely involve API calls to a backend service or a database for persistence.

// Initialize cartItems from localStorage if available (client-side only)
let cartItems: { product: Product; quantity: number }[] = [];

// Initialize the cart from localStorage on the client side
const initializeCart = () => {
  // Only run in browser environment
  if (typeof window !== "undefined") {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        cartItems = JSON.parse(savedCart);
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
  }
};

// Save cart to localStorage
const saveCartToStorage = () => {
  // Only run in browser environment
  if (typeof window !== "undefined") {
    try {
      // Create a simplified version of the cart for storage
      const storableCart = cartItems.map((item) => ({
        product: {
          ec_product_id: item.product.ec_product_id,
          ec_name: item.product.ec_name,
          ec_price: item.product.ec_price,
          ec_images: item.product.ec_images,
        },
        quantity: item.quantity,
      }));

      localStorage.setItem("cart", JSON.stringify(storableCart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }
};

// Initialize on module load (client-side only)
initializeCart();

export type CartItem = {
  product: Product;
  quantity: number;
};

// Define strongly typed checkout results based on success state
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

export const CartService = {
  addToCart: (product: Product, quantity: number = 1) => {
    const existingItemIndex = cartItems.findIndex((item) => item.product.ec_product_id === product.ec_product_id);

    if (existingItemIndex >= 0) {
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      cartItems.push({ product, quantity });
    }

    saveCartToStorage();
    return [...cartItems];
  },

  removeFromCart: (productId: string) => {
    cartItems = cartItems.filter((item) => item.product.ec_product_id !== productId);
    saveCartToStorage();
    return [...cartItems];
  },

  updateQuantity: (productId: string, quantity: number) => {
    const itemIndex = cartItems.findIndex((item) => item.product.ec_product_id === productId);

    if (itemIndex >= 0 && quantity > 0) {
      cartItems[itemIndex].quantity = quantity;
    }

    saveCartToStorage();
    return [...cartItems];
  },

  getCartItems: () => {
    return [...cartItems];
  },

  getCartCount: () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  },

  getSubtotal: () => {
    return cartItems.reduce((total, item) => total + Number(item.product.ec_price) * item.quantity, 0);
  },

  getTaxes: () => {
    const subtotal = CartService.getSubtotal();
    return subtotal * 0.07; // Fixed 7% tax rate
  },

  getTotalWithTax: () => {
    const subtotal = CartService.getSubtotal();
    const taxes = CartService.getTaxes();
    return subtotal + taxes;
  },

  clearCart: () => {
    cartItems = [];
    saveCartToStorage();
    return [];
  },

  getCartItemsWithMetadata: (): CartInitialState["items"] => {
    return cartItems.map((item) => ({
      name: item.product.ec_name!,
      price: item.product.ec_price!,
      productId: item.product.ec_product_id!,
      quantity: item.quantity,
    }));
  },

  checkout: (): CheckoutResult => {
    if (cartItems.length === 0) {
      return {
        success: false,
        message: "Cart is empty",
      };
    }

    const transactionId = uuidv4();
    const revenue = CartService.getTotalWithTax();

    CartService.clearCart();

    return {
      success: true,
      transactionId,
      revenue,
    };
  },
};
