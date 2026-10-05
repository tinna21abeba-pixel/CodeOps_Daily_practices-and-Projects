"use client";

import useSWR from "swr";
import fetcher from "@/app/lib/fetcher";

export default function OrderStatus({ orderId, initialOrder }) {
  const { data, error, isLoading } = useSWR(
    orderId ? `/api/orders/${orderId}` : null,
    fetcher,
    {
      refreshInterval: 5000,
      fallbackData: initialOrder ? { order: initialOrder } : undefined,
    }
  );

  if (!orderId) {
    return (
      <div className="max-w-md mx-auto py-8">
        <p className="text-stone-600">Please provide an order ID.</p>
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <div className="max-w-md mx-auto py-8">
        <p className="text-stone-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto py-8">
        <p className="text-red-500">Error loading order.</p>
      </div>
    );
  }

  if (!data?.order) {
    return (
      <div className="max-w-md mx-auto py-8">
        <p className="text-stone-500">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-stone-900 mb-4">Order Status</h2>
        <div className="space-y-2 text-stone-700 text-sm">
          <p><span className="font-semibold">Status:</span> {data.order.status}</p>
          <p><span className="font-semibold">Order ID:</span> {data.order.id}</p>
          <p><span className="font-semibold">Customer:</span> {data.order.customerName}</p>
          {data.order.food && <p><span className="font-semibold">Food:</span> {data.order.food}</p>}
          {data.order.quantity && <p><span className="font-semibold">Quantity:</span> {data.order.quantity}</p>}
        </div>
      </div>
    </div>
  );
}