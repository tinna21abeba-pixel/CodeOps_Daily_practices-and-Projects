"use client";

import { useState } from "react";

export default function MenuCounter() {
  const [count, setCount] = useState(0);

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm text-center">
      <p className="text-stone-700 font-medium mb-3 text-sm">
        Count: <span className="font-bold text-orange-600 text-base">{count}</span>
      </p>
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setCount(count + 1)}
          className="min-h-[44px] min-w-[44px] px-4 py-2.5 inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
        >
          Increase
        </button>
        <button
          type="button"
          onClick={() => setCount(count - 1)}
          className="min-h-[44px] min-w-[44px] px-4 py-2.5 inline-flex items-center justify-center bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg border border-stone-300 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500"
        >
          Decrease
        </button>
      </div>
    </div>
  );
}
