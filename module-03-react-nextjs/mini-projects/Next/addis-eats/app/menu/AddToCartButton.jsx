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
      onClick={handleClick}
      className={
        className ||
        `flex-1 py-2 rounded-lg font-semibold transition ${
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
