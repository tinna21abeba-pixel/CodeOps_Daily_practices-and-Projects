"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";

export default function AddToCartButton({ dish, className = "" }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    addItem(dish);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={
        className ||
        `min-h-[44px] px-4 py-2.5 inline-flex items-center justify-center rounded-lg font-semibold text-xs transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 ${
          added
            ? "bg-green-600 text-white"
            : "bg-amber-500 hover:bg-amber-600 text-white"
        }`
      }
    >
      {added ? "Added!" : "Add to Cart"}
    </button>
  );
}
