"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../actions/orders";

const inputClass =
  "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500";

function FieldError({ errors }) {
  if (!errors?.length) return null;
  return <p className="text-red-400 text-xs mt-1">{errors[0]}</p>;
}

export default function CheckoutForm() {
  const { items, clearCart } = useCart();
  const [state, formAction, isPending] = useActionState(placeOrder, null);


  useEffect(() => {
    if (state?.ok) clearCart();
  }, [state, clearCart]);

  if (state?.ok) {
    return (
      <div className="text-center">
        <p className="text-green-400 font-semibold mb-2">Order placed!</p>
        <p className="text-zinc-300 mb-6">
          Your order number is <span className="font-bold text-amber-500">{state.orderId}</span>.
        </p>
        <Link href="/orders/mine" className="inline-block bg-amber-500 hover:bg-amber-600 transition px-6 py-3 rounded-lg font-semibold text-white">
          View my orders
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center">
        <p className="text-zinc-400 mb-6">Your cart is empty.</p>
        <Link href="/menu" className="inline-block bg-amber-500 hover:bg-amber-600 transition px-6 py-3 rounded-lg font-semibold text-white">
          Browse Menu
        </Link>
      </div>
    );
  }

  const total = items.reduce((sum, i) => sum + i.price * (i.quantity || 1), 0);
  const errors = state?.fieldErrors ?? {};
  const v = state?.values ?? {};
 
  const payload = JSON.stringify(
    items.map((i) => ({ dishId: i.id, quantity: i.quantity || 1 }))
  );

  return (
    <form action={formAction} className="flex flex-col gap-4 text-left">
      <input type="hidden" name="items" value={payload} />

      {state && !state.ok && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          {state.message}
          <FieldError errors={errors.items} />
        </p>
      )}

      <div>
        <label htmlFor="name" className="block text-sm text-zinc-400 mb-1">Full name</label>
        <input id="name" name="name" defaultValue={v.name} className={inputClass} placeholder="Abebe Kebede" />
        <FieldError errors={errors.name} />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm text-zinc-400 mb-1">Phone</label>
        <input id="phone" name="phone" defaultValue={v.phone} className={inputClass} placeholder="0911234567" inputMode="tel" />
        <FieldError errors={errors.phone} />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm text-zinc-400 mb-1">Delivery address</label>
        <input id="address" name="address" defaultValue={v.address} className={inputClass} placeholder="Bole, Addis Ababa" />
        <FieldError errors={errors.address} />
      </div>

      <div>
        <label htmlFor="note" className="block text-sm text-zinc-400 mb-1">Note (optional)</label>
        <textarea id="note" name="note" defaultValue={v.note} rows={2} className={inputClass} />
        <FieldError errors={errors.note} />
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
        <span className="text-zinc-400">Total</span>
        <span className="text-2xl font-bold text-amber-500">{total} ETB</span>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed transition py-3 rounded-lg font-semibold text-white"
      >
        {isPending ? "Placing order..." : "Place Order"}
      </button>
    </form>
  );
}