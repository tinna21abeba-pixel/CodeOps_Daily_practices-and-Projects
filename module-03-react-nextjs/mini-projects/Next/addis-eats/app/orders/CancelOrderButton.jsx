"use client";

import { useActionState } from "react";
import { cancelOrder } from "../actions/orders";

export default function CancelOrderButton({ orderId }) {
  const [state, formAction, isPending] = useActionState(cancelOrder, null);

  return (
    <form action={formAction} className="mt-3 flex items-center gap-3">
      <input type="hidden" name="orderId" value={orderId} />
      <button
        type="submit"
        disabled={isPending}
        className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50 font-medium transition"
      >
        {isPending ? "Cancelling..." : "Cancel order"}
      </button>
      {state && !state.ok && <span className="text-xs text-red-400">{state.message}</span>}
    </form>
  );
}