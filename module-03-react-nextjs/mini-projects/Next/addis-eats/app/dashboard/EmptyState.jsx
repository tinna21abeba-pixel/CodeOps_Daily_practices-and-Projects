import Link from "next/link";

export default function EmptyState({ isForced = false }) {
  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-8 sm:p-12 text-center max-w-2xl mx-auto my-8 shadow-xl">
      <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-amber-400 mb-4 border border-zinc-700">
        Empty State View
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
        No Order Data to Display
      </h2>

      <p className="text-zinc-400 text-sm sm:text-base mt-3 max-w-md mx-auto leading-relaxed">
        There are currently no recorded orders in the restaurant system.
        Revenue by neighbourhood, daily order timeline, and the order table will
        populate here once customer transactions are submitted.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 text-left">
        <div className="p-4 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/60">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
            Revenue by Neighbourhood
          </div>
          <div className="h-20 flex items-center justify-center text-xs text-zinc-500">
            Awaiting order locations and totals in ETB
          </div>
        </div>

        <div className="p-4 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/60">
          <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
            Orders Over Time
          </div>
          <div className="h-20 flex items-center justify-center text-xs text-zinc-500">
            Awaiting daily order volume timeline
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {isForced ? (
          <Link
            href="/dashboard"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 text-sm font-bold transition shadow-sm"
          >
            Show Live Dashboard Data
          </Link>
        ) : (
          <Link
            href="/checkout"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 text-sm font-bold transition shadow-sm"
          >
            Place First Order
          </Link>
        )}

        <Link
          href="/menu"
          className="px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium transition"
        >
          Browse Menu
        </Link>
      </div>
    </div>
  );
}
