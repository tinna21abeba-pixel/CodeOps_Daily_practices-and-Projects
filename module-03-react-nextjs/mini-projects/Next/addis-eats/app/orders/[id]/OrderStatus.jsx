"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { etb, when, relative } from "../../../lib/format";

const DeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => (
    <div
      style={{ height: "300px" }}
      className="mt-6 w-full h-[300px] bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-500 text-xs"
    >
      Loading map...
    </div>
  ),
});

const FINAL = ["delivered", "cancelled"];
const STEPS = ["pending", "preparing", "on_the_way", "delivered"];

export default function OrderStatus({ id, initialOrder }) {
  const [order, setOrder] = useState(initialOrder);
  const [connected, setConnected] = useState(false);
  const [connectionLabel, setConnectionLabel] = useState(
    initialOrder?.status === "delivered"
      ? "Delivered"
      : initialOrder?.status === "cancelled"
      ? "Cancelled"
      : "Connecting"
  );

  useEffect(() => {
    if (!id) return;

    if (FINAL.includes(initialOrder?.status)) {
      setConnected(false);
      setConnectionLabel(
        initialOrder.status === "delivered" ? "Delivered" : "Cancelled"
      );
      return;
    }

    const eventSource = new EventSource(`/api/orders/${id}/stream`);

    eventSource.onopen = () => {
      setConnected(true);
      setConnectionLabel("Connected");
    };

    eventSource.onmessage = (event) => {
      try {
        const updated = JSON.parse(event.data);
        setOrder(updated);

        if (FINAL.includes(updated.status)) {
          eventSource.close();
          setConnected(false);
          setConnectionLabel(
            updated.status === "delivered" ? "Delivered" : "Cancelled"
          );
        }
      } catch {}
    };

    eventSource.onerror = () => {
      eventSource.close();
      setConnected(false);
      setConnectionLabel("Disconnected");
    };

    return () => {
      eventSource.close();
    };
  }, [id, initialOrder?.status]);

  const stepIndex = STEPS.indexOf(order?.status);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-4">
        <p
          className={`text-xl font-bold uppercase tracking-wide ${
            order?.status === "cancelled"
              ? "text-red-400"
              : order?.status === "delivered"
              ? "text-emerald-400"
              : "text-amber-400"
          }`}
        >
          {order?.status?.replace("_", " ")}
        </p>

        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">Stream:</span>
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
              connected
                ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                : connectionLabel === "Delivered"
                ? "bg-amber-950 text-amber-400 border border-amber-800"
                : "bg-zinc-800 text-zinc-400 border border-zinc-700"
            }`}
          >
            {connectionLabel}
          </span>
        </div>
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

      <ul className="text-sm text-zinc-300 mb-4 divide-y divide-zinc-800/60">
        {order?.items?.map((i) => (
          <li key={i.dishId} className="py-1 flex justify-between">
            <span>
              {i.quantity} x {i.name}
            </span>
            <span className="text-zinc-400">{etb(i.price * i.quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
        <div>
          <p className="text-amber-500 font-bold text-lg">{etb(order?.total)}</p>
          {order?.createdAt && (
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Placed {when(order.createdAt)} ({relative(order.createdAt)})
            </p>
          )}
        </div>
        {order?.address && (
          <p className="text-xs text-zinc-400 text-right max-w-[200px] truncate">
            {order.address}
          </p>
        )}
      </div>

      <DeliveryMap
        neighbourhood={order?.neighbourhood}
        address={order?.address}
        status={order?.status}
      />
    </div>
  );
}
