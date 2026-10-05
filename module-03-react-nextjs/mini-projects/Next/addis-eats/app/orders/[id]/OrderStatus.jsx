"use client";

import useSWR from "swr";

const FINAL = ["delivered", "cancelled"];
const STEPS = ["pending", "preparing", "on_the_way", "delivered"];

export default function OrderStatus({ id, initialOrder }) {
  const { data, error, isValidating } = useSWR(`/api/orders/${id}`, {
    fallbackData: { order: initialOrder },
    refreshInterval: (latest) =>
      FINAL.includes(latest?.order?.status) ? 0 : 5000,
    dedupingInterval: 2000,
    shouldRetryOnError: (err) => err.status !== 404,
  });

  const order = data?.order || initialOrder;
  const stepIndex = STEPS.indexOf(order?.status);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <p
          className={`text-xl font-bold ${
            order?.status === "cancelled" ? "text-red-400" : "text-green-400"
          }`}
        >
          {order?.status?.replace("_", " ")}
        </p>
        <span className="text-xs text-zinc-500">
          {FINAL.includes(order?.status)
            ? "Final status"
            : isValidating
            ? "Updating..."
            : "Live · refreshes every 5s"}
        </span>
      </div>

      {order?.status !== "cancelled" && (
        <ol className="flex gap-2 mb-6">
          {STEPS.map((s, i) => (
            <li
              key={s}
              className={`flex-1 h-2 rounded-full ${
                i <= stepIndex ? "bg-amber-500" : "bg-zinc-700"
              }`}
              title={s}
            />
          ))}
        </ol>
      )}

      <ul className="text-sm text-zinc-300 mb-4">
        {order?.items?.map((i) => (
          <li key={i.dishId}>
            {i.quantity} x {i.name}
          </li>
        ))}
      </ul>
      <p className="text-amber-500 font-bold">{order?.total} ETB</p>

      {error && (
        <p className="text-red-400 text-xs mt-3">
          Could not refresh: {error.message}. Showing the last known status.
        </p>
      )}
    </div>
  );
}
