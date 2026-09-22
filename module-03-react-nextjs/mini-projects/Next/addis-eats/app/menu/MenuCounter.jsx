"use client";

import { useState } from "react";

export default function MenuCounter() {
  const [counter, setCounter] = useState(0);

  return (
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
  );
}
