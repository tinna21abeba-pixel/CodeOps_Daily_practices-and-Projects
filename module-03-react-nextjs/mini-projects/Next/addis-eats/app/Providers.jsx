"use client";

import { SWRConfig } from "swr";
import { CartProvider } from "./context/CartContext";
import { fetcher } from "./lib/fetcher";

export default function Providers({ children }) {
  return (
    <SWRConfig value={{ fetcher }}>
      <CartProvider>{children}</CartProvider>
    </SWRConfig>
  );
}