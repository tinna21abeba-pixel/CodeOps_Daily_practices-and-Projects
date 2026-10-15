"use client";

import { useTransition } from "react";
import { cancelOrder } from "@/app/actions/orders";

export default function CancelOrderButton({ orderId }) {
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    if (isPending) {
      return;
    }
    startTransition(async () => {
      await cancelOrder(orderId);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCancel}
      disabled={isPending}
      aria-busy={isPending ? "true" : "false"}
      className="min-h-[44px] px-4 py-2 text-xs bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed inline-flex items-center justify-center"
    >
      {isPending ? "Cancelling..." : "Cancel"}
    </button>
  );
}
