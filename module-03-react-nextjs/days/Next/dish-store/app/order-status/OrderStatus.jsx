"use client";

import useSWR from "swr";
import fetcher from "@/app/lib/fetcher";

export default function OrderStatus({ orderId }) {
  const { data, error, isLoading } = useSWR(
    `/api/orders/${orderId}`,
    fetcher,
    { refreshInterval: 5000 }
  );

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error loading order.</div>;

  if (!data?.order) return <div>Order not found.</div>;

  return (
    <div>
      <p>Status: {data.order.status}</p>
      <p>Order ID: {data.order.id}</p>
      <p>Customer: {data.order.customerName}</p>
    </div>
  );
}