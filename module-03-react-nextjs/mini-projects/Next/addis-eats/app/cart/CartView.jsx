"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function CartView() {
  const { items, removeItem, clearCart } = useCart();

  const total = items.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  if (items.length === 0) {
    return (
      <div className="text-center">
        <p className="text-zinc-400 mb-8">
          Your shopping cart is currently empty.
        </p>
        <Link
          href="/menu"
          className="inline-block bg-amber-500 hover:bg-amber-600 transition px-6 py-3 rounded-lg font-semibold text-white"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left">
      <div className="divide-y divide-zinc-800">
        {items.map((item) => (
          <div
            key={item.id}
            className="py-4 flex items-center justify-between gap-4"
          >
            <div>
              <h3 className="font-bold text-white text-base">{item.name}</h3>
              <p className="text-zinc-400 text-xs mt-0.5">
                {item.price} ETB &times; {item.quantity || 1}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold text-amber-500">
                {item.price * (item.quantity || 1)} ETB
              </span>
              <button
                onClick={() => removeItem(item.id)}
                className="text-xs text-red-400 hover:text-red-300 font-medium transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
        <span className="text-zinc-400 font-medium">Total</span>
        <span className="text-2xl font-bold text-amber-500">{total} ETB</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-2">
        <Link
          href="/checkout"
          className="flex-1 text-center bg-amber-500 hover:bg-amber-600 transition py-3 rounded-lg font-semibold text-white"
        >
          Proceed to Checkout
        </Link>
        <button
          onClick={clearCart}
          className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 transition rounded-lg text-sm text-zinc-300 font-medium"
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}
