import Link from "next/link";

/**
 * Exercise: Build the empty state first — before there is any data to display.
 * This component is rendered when there are no orders in the system,
 * or when the user/tester forces the empty state via `?empty=true`.
 */
export default function EmptyState({ isForced = false }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 text-center max-w-2xl mx-auto my-8 shadow-sm">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-5 border border-orange-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 sm:w-10 sm:h-10"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
          />
        </svg>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 mb-3">
        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
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

      {/* Visual Placeholder Previews */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 text-left">
        <div className="p-4 rounded-xl border border-dashed border-stone-200 bg-stone-50/50">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
            Revenue by Neighbourhood
          </div>
          <div className="h-20 flex items-center justify-center text-xs text-stone-400">
            Awaiting order locations and totals (ETB)...
          </div>
        </div>

        <div className="p-4 rounded-xl border border-dashed border-stone-200 bg-stone-50/50">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
            Orders Per Day
          </div>
          <div className="h-20 flex items-center justify-center text-xs text-stone-400">
            Awaiting daily order counts (Orders / Day)...
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {isForced ? (
          <Link
            href="/dashboard"
            className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            Show Live Dashboard Data
          </Link>
        ) : (
          <Link
            href="/checkout"
            className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            Place First Order
          </Link>
        )}

        <Link
          href="/menu"
          className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-semibold transition-colors"
        >
          Browse Dishes
        </Link>
      </div>
    </div>
  );
}
