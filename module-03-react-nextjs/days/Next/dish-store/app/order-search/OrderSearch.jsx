"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import fetcher from "@/app/lib/fetcher";

export default function OrderSearch() {
  const [term, setTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(term);
    }, 500);

    return () => clearTimeout(timer);
  }, [term]);

  const handleTermChange = (e) => {
    setTerm(e.target.value);
    setPage(1);
  };

  const { data, error, isLoading, isValidating } = useSWR(
    debouncedTerm
      ? `/api/orders?search=${encodeURIComponent(
          debouncedTerm
        )}&page=${page}`
      : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  return (
    <div className="max-w-2xl mx-auto py-6">
      <h2 className="text-2xl font-bold text-stone-900 mb-6">Search Orders</h2>

      <input
        type="text"
        value={term}
        onChange={handleTermChange}
        placeholder="Search by customer name..."
        className="w-full px-4 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-6 bg-white text-stone-900 placeholder-stone-400"
      />

      {error && <p className="text-red-500 text-sm mb-4">Failed to load orders.</p>}

      {isLoading && !data && <p className="text-stone-500 text-sm mb-4">Loading...</p>}

      {isValidating && data && <p className="text-stone-400 text-xs mb-3">Updating results...</p>}

      {data?.orders?.length === 0 && (
        <p className="text-stone-500 text-sm mb-4">No orders found.</p>
      )}

      <div className="space-y-3 mb-6">
        {data?.orders?.map((order) => (
          <div key={order.id} className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
            <p className="text-sm font-semibold text-stone-900">Order ID: {order.id}</p>
            <p className="text-sm text-stone-600">Customer: {order.customerName}</p>
            <p className="text-sm text-stone-600">Status: {order.status}</p>
            {order.food && <p className="text-sm text-stone-600">Food: {order.food}</p>}
            {order.quantity && <p className="text-sm text-stone-600">Quantity: {order.quantity}</p>}
          </div>
        ))}
      </div>

      {data && data.orders && data.orders.length > 0 && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPage((current) => current - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 disabled:opacity-40 text-stone-700 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-sm font-medium text-stone-700">Page {page}</span>

          <button
            onClick={() => setPage((current) => current + 1)}
            disabled={!data.hasNextPage}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 disabled:opacity-40 text-stone-700 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}