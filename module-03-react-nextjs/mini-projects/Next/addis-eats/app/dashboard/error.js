"use client";

import Link from "next/link";

export default function DashboardError({ error, reset }) {
  return (
    <div className="max-w-2xl mx-auto py-16 px-6 text-center text-white">
      <div className="bg-zinc-900 border border-red-500/50 p-8 sm:p-10 rounded-2xl shadow-2xl">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-950 text-red-400 mb-4 border border-red-800">
          Error State View
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Failed to Load Dashboard
        </h1>

        <p className="text-sm text-zinc-300 mt-3 leading-relaxed max-w-md mx-auto">
          {error?.message ||
            "An unexpected error occurred while aggregating order analytics and revenue metrics on the server."}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-sm rounded-xl transition cursor-pointer"
          >
            Try Again
          </button>

          <Link
            href="/dashboard"
            className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-xl transition"
          >
            Reset to Live Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
