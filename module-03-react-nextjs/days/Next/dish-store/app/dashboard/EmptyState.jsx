import Link from "next/link";

export default function EmptyState({ isForced = false }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 text-center max-w-2xl mx-auto my-8 shadow-sm">
      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 mb-3">
        Empty State View
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
        No Order Data to Display
      </h2>

      <p className="text-stone-600 text-sm sm:text-base mt-2 max-w-md mx-auto leading-relaxed">
        There are currently no recorded orders in the restaurant system.
        Charts, neighbourhood revenue summaries, and daily order volumes will
        populate here once orders are placed.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 text-left">
        <div className="p-4 rounded-xl border border-dashed border-stone-200 bg-stone-50/50">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
            Revenue by Neighbourhood
          </div>
          <div className="h-20 flex items-center justify-center text-xs text-stone-400">
            Awaiting order locations and totals (ETB)
          </div>
        </div>

        <div className="p-4 rounded-xl border border-dashed border-stone-200 bg-stone-50/50">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
            Orders Per Day
          </div>
          <div className="h-20 flex items-center justify-center text-xs text-stone-400">
            Awaiting daily order counts (Orders / Day)
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {isForced ? (
          <Link
            href="/dashboard"
            className="min-h-[44px] px-4 py-2.5 inline-flex items-center justify-center rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            Show Live Dashboard Data
          </Link>
        ) : (
          <Link
            href="/checkout"
            className="min-h-[44px] px-4 py-2.5 inline-flex items-center justify-center rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold transition-colors shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            Place First Order
          </Link>
        )}

        <Link
          href="/menu"
          className="min-h-[44px] px-4 py-2.5 inline-flex items-center justify-center rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-500"
        >
          Browse Dishes
        </Link>
      </div>
    </div>
  );
}
