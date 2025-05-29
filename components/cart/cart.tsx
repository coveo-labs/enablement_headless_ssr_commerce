"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useMockedCartService } from "@/components/providers/cart-provider";
import { useCart } from "@/lib/commerce-engine";

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, subtotal, taxes, totalWithTax, checkout } = useMockedCartService();
  const coveoHeadlessCart = useCart();
  console.log(coveoHeadlessCart.state.items);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl font-medium text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven&apos;t added any products to your cart yet.</p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => {
                  const coveoHeadlessCartItem = {
                    productId: item.product.ec_product_id!,
                    name: item.product.ec_name!,
                    price: item.product.ec_price!,
                  };
                  return (
                    <li key={item.product.ec_product_id} className="p-6 flex flex-col sm:flex-row">
                      <div className="flex-shrink-0 w-24 h-24 rounded-md overflow-hidden relative mb-4 sm:mb-0">
                        <Image
                          src={item.product.ec_images[0]}
                          alt={item.product.ec_name || "Product"}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                      </div>
                      <div className="sm:ml-6 flex-1 flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{item.product.ec_name}</h3>
                          <p className="mt-1 text-sm text-gray-500">${item.product.ec_price}</p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex items-center">
                          <button
                            onClick={() => {
                              coveoHeadlessCart.methods?.updateItemQuantity({
                                ...coveoHeadlessCartItem,
                                quantity: item.quantity - 1,
                              });
                              updateQuantity(item.product.ec_product_id!, item.quantity - 1);
                            }}
                            className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                          >
                            <span className="sr-only">Decrease</span>
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="mx-2 text-gray-700">{item.quantity}</span>
                          <button
                            onClick={() => {
                              coveoHeadlessCart.methods?.updateItemQuantity({
                                ...coveoHeadlessCartItem,
                                quantity: item.quantity + 1,
                              });
                              updateQuantity(item.product.ec_product_id!, item.quantity + 1);
                            }}
                            className="p-1 rounded-full text-gray-400 hover:text-gray-500"
                          >
                            <span className="sr-only">Increase</span>
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              coveoHeadlessCart.methods?.updateItemQuantity({
                                ...coveoHeadlessCartItem,
                                quantity: 0,
                              });
                              removeFromCart(item.product.ec_product_id!);
                            }}
                            className="ml-4 text-sm font-medium text-red-600 hover:text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>

              <div className="flow-root">
                <dl className="-my-4 text-sm divide-y divide-gray-200">
                  <div className="py-4 flex justify-between">
                    <dt className="text-gray-600">Subtotal</dt>
                    <dd className="font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
                  </div>
                  <div className="py-4 flex justify-between">
                    <dt className="text-gray-600">Tax</dt>
                    <dd className="font-medium text-gray-900">${taxes.toFixed(2)}</dd>
                  </div>
                  <div className="py-4 flex justify-between">
                    <dt className="text-lg font-bold text-gray-900">Total</dt>
                    <dd className="text-lg font-bold text-gray-900">${totalWithTax.toFixed(2)}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-8">
                <button
                  type="button"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  onClick={() => {
                    console.log(coveoHeadlessCart.state.items);
                    const checkoutResult = checkout();
                    if (checkoutResult.success) {
                      coveoHeadlessCart.methods?.purchase({
                        id: checkoutResult.transactionId,
                        revenue: checkoutResult.revenue,
                      });
                    }
                  }}
                >
                  Proceed to Checkout
                </button>
              </div>

              <div className="mt-4">
                <Link
                  href="/"
                  className="w-full inline-flex justify-center text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
