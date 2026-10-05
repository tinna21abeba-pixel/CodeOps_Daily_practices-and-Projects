"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function CartView() {
  const { items, remove, clear } = useCart();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-stone-700 mb-2">Your cart is empty</h2>
        <Link
          href="/menu"
          className="inline-block mt-4 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="divide-y divide-stone-200 mb-6">
        {items.map((item) => (
          <div key={item.id} className="py-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-stone-900">{item.name}</p>
              <p className="text-xs text-stone-500">
                {item.quantity} x {item.price} ETB
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold text-orange-600 text-sm">
                {(item.price * item.quantity).toFixed(2)} ETB
              </span>
              <button
                onClick={() => remove(item.id)}
                className="text-xs text-red-600 hover:text-red-700 font-medium cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-stone-200 flex items-center justify-between mb-6">
        <span className="text-base font-semibold text-stone-700">Total</span>
        <span className="text-xl font-bold text-orange-600">{total} ETB</span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <button
          onClick={clear}
          className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          Clear Cart
        </button>
        <Link
          href="/checkOut"
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}