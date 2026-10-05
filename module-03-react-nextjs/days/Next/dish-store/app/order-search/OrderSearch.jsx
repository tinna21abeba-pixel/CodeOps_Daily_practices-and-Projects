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

 
  useEffect(() => {
    setPage(1);
  }, [debouncedTerm]);

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
    <div>
      <h2>Search Orders</h2>

      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search by customer name..."
      />

      {error && <p>Failed to load orders.</p>}

      {isLoading && !data && <p>Loading...</p>}

      {isValidating && data && <p>Updating results...</p>}

      {data?.orders?.length === 0 && (
        <p>No orders found.</p>
      )}

      {data?.orders?.map((order) => (
        <div key={order.id}>
          <p>Order ID: {order.id}</p>
          <p>Customer: {order.customerName}</p>
          <p>Status: {order.status}</p>
        </div>
      ))}

      {data && (
        <div>
          <button
            onClick={() => setPage((current) => current - 1)}
            disabled={page === 1}
          >
            Previous
          </button>

          <span> Page {page} </span>

          <button
            onClick={() => setPage((current) => current + 1)}
            disabled={!data.hasNextPage}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}