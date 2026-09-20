"use client";

import { useState } from "react";
import Link from "next/link";
import dishes from "../data/dishes";

export default function MenuSidebar() {
  const [note, setNote] = useState("");
  const [counter, setCounter] = useState(0);

  return (
    <aside className="w-full md:w-64 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 p-6 flex flex-col gap-6 shrink-0">
      <div>
        <h2 className="text-lg font-bold text-amber-500 mb-2">Menu Navigation</h2>
        <nav className="flex flex-col gap-1">
          <Link
            href="/menu"
            className="text-zinc-300 hover:text-amber-500 transition py-1 text-sm font-medium"
          >
            All Dishes
          </Link>
          <div className="text-xs uppercase text-zinc-500 font-semibold tracking-wider mt-3 mb-1">
            Quick Links
          </div>
          {dishes.slice(0, 6).map((dish) => (
            <Link
              key={dish.id}
              href={`/menu/${dish.id}`}
              className="text-zinc-400 hover:text-amber-400 transition py-1 text-sm truncate"
            >
              {dish.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="bg-zinc-800/60 p-4 rounded-xl border border-zinc-700/50">
        <h3 className="text-sm font-semibold text-zinc-200 mb-1">
          Sidebar State
        </h3>
        <p className="text-xs text-zinc-400 mb-3">
          State is preserved across menu navigations.
        </p>
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setCounter((c) => c + 1)}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-semibold transition"
          >
           count: {counter}
          </button>
          <button
            onClick={() => setCounter(0)}
            className="px-2 py-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 rounded text-xs transition"
          >
            Reset
          </button>
        </div>
        
      </div>
    </aside>
  );
}
