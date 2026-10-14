"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { etb, when, relative } from "@/lib/format";

const DeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => (
    <div>
      <div
        style={{ height: "380px" }}
        className="w-full h-[380px] bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-500 text-xs"
      >
        Loading map...
      </div>
      <div className="mt-4 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs h-[106px] flex items-center justify-center text-zinc-600">
        Loading coordinates...
      </div>
    </div>
  ),
});

const FINAL = ["delivered", "cancelled"];
const STEPS = ["pending", "preparing", "on_the_way", "delivered"];

function getCourierSummary(status, neighbourhood) {
  const dest = neighbourhood || "delivery address";
  switch (status) {
    case "pending":
      return "Order received at kitchen. Awaiting preparation.";
    case "preparing":
      return "Kitchen is preparing your meal. Courier awaiting pickup at dispatch.";
    case "on_the_way":
      return `Courier in transit to ${dest}. Moving along delivery route.`;
    case "delivered":
      return `Order delivered at ${dest}. Completed.`;
    case "cancelled":
      return "Order has been cancelled.";
    default:
      return "Tracking order status.";
  }
}

export default function OrderStatus({ id, initialOrder }) {
  const [order, setOrder] = useState(initialOrder);
  const [connectionState, setConnectionState] = useState(
    FINAL.includes(initialOrder?.status)
      ? initialOrder?.status
      : "connecting"
  );

  useEffect(() => {
    if (!id || FINAL.includes(initialOrder?.status)) return;

    const eventSource = new EventSource(`/api/orders/${id}/stream`);

    eventSource.onopen = () => {
      setConnectionState("connected");
    };

    eventSource.onmessage = (event) => {
      try {
        const updated = JSON.parse(event.data);
        setOrder(updated);

        if (FINAL.includes(updated.status)) {
          eventSource.close();
          setConnectionState(updated.status);
        }
      } catch {}
    };

    eventSource.onerror = () => {
      eventSource.close();
      setConnectionState("disconnected");
    };

    return () => {
      eventSource.close();
    };
  }, [id, initialOrder?.status]);

  const stepIndex = STEPS.indexOf(order?.status);
  const courierSummary = getCourierSummary(order?.status, order?.neighbourhood);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
          <div>
            <p className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">
              Live Order Status
            </p>
            <p
              className={`text-2xl font-bold uppercase tracking-wide mt-1 ${
                order?.status === "cancelled"
                  ? "text-red-400"
                  : order?.status === "delivered"
                  ? "text-emerald-400"
                  : "text-amber-400"
              }`}
            >
              {order?.status?.replace(/_/g, " ")}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-zinc-400 block mb-1">Stream Status</span>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-medium inline-block ${
                connectionState === "connected"
                  ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                  : connectionState === "connecting"
                  ? "bg-amber-950 text-amber-400 border border-amber-800"
                  : connectionState === "delivered"
                  ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                  : connectionState === "cancelled"
                  ? "bg-red-950 text-red-400 border border-red-800"
                  : "bg-zinc-800 text-zinc-400 border border-zinc-700"
              }`}
            >
              {connectionState.charAt(0).toUpperCase() + connectionState.slice(1)}
            </span>
          </div>
        </div>

        {order?.status !== "cancelled" && (
          <div>
            <ol className="flex gap-2">
              {STEPS.map((s, i) => (
                <li
                  key={s}
                  className={`flex-1 h-2 rounded-full ${
                    i <= stepIndex ? "bg-amber-500" : "bg-zinc-700"
                  }`}
                  title={s.replace(/_/g, " ")}
                />
              ))}
            </ol>
            <div className="flex justify-between text-[11px] text-zinc-500 mt-2 font-mono uppercase">
              <span>Pending</span>
              <span>Preparing</span>
              <span>On The Way</span>
              <span>Delivered</span>
            </div>
          </div>
        )}

        <div
          aria-live="polite"
          className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3"
        >
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
            Delivery Text Information
          </p>
          <div className="space-y-1.5 text-xs text-zinc-300">
            <div className="flex justify-between">
              <span className="text-zinc-500">Progress:</span>
              <span className="font-medium text-zinc-200">{courierSummary}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Destination:</span>
              <span className="font-medium text-zinc-200">
                {order?.address || "No address provided"}
                {order?.neighbourhood ? ` (${order.neighbourhood})` : ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Recipient:</span>
              <span className="font-medium text-zinc-200">{order?.name || "Customer"}</span>
            </div>
            {order?.phone && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Contact:</span>
                <span className="font-mono text-zinc-200">{order.phone}</span>
              </div>
            )}
            {order?.note && (
              <div className="flex justify-between">
                <span className="text-zinc-500">Instructions:</span>
                <span className="font-medium text-amber-200/90 italic">{order.note}</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Items in Order
          </p>
          <ul className="text-sm text-zinc-300 divide-y divide-zinc-800/70 border-t border-b border-zinc-800/70">
            {order?.items?.map((item, idx) => (
              <li key={item.dishId || idx} className="py-2.5 flex justify-between items-center">
                <span>
                  {item.quantity} x {item.name}
                </span>
                <span className="font-mono text-zinc-400">
                  {etb((item.price || 0) * (item.quantity || 1))}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-between items-center pt-2">
          <div>
            <p className="text-xs text-zinc-500 uppercase">Total Amount</p>
            <p className="text-2xl font-bold text-amber-500 font-mono mt-0.5">
              {etb(order?.total)}
            </p>
            {order?.createdAt && (
              <p className="text-[11px] text-zinc-500 mt-1">
                Placed {when(order.createdAt)} ({relative(order.createdAt)})
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 text-right">
            <a
              href={`/api/orders/export?id=${order?.id}`}
              download={`order-${order?.id}.csv`}
              className="text-xs font-bold px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 rounded-xl transition"
            >
              Export Order CSV
            </a>
            <a
              href="/api/orders/export"
              download="orders.csv"
              className="text-xs font-medium px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition"
            >
              Export History CSV
            </a>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">
            Live Delivery Map
          </p>
          <span className="text-[11px] font-mono text-zinc-400">
            OpenStreetMap & Leaflet
          </span>
        </div>

        <DeliveryMap
          neighbourhood={order?.neighbourhood}
          address={order?.address}
          status={order?.status}
        />
      </div>
    </div>
  );
}
