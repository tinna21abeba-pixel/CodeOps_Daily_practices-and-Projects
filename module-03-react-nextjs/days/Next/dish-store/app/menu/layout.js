"use client";

import CategoryBar from "./CategoryBar";
import { useState } from "react";

export default function MenuLayout({ children }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
          <CategoryBar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm text-center">
          <p className="text-stone-700 font-medium mb-3 text-sm">
            Count: <span className="font-bold text-orange-600 text-base">{count}</span>
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setCount(count + 1)}
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Increase
            </button>
            <button
              onClick={() => setCount(count - 1)}
              className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold px-3 py-2 rounded-lg border border-stone-300 transition-colors cursor-pointer"
            >
              Decrease
            </button>
          </div>
        </div>
      </aside>

      <section className="flex-1 w-full min-w-0">{children}</section>
    </div>
  );
}

