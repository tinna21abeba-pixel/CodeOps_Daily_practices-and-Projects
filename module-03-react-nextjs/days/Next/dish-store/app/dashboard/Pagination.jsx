import Link from "next/link";

/**
 * Exercise 7:
 * Add paging with Link elements, then write and force each of the four states.
 *
 * The Four States of Pagination:
 * 1. FIRST PAGE:  page === 1, totalPages > 1   -> Previous disabled, Next active.
 * 2. MIDDLE PAGE: 1 < page < totalPages        -> Previous active, Next active.
 * 3. LAST PAGE:   page === totalPages > 1     -> Previous active, Next disabled.
 * 4. SINGLE PAGE: totalPages <= 1             -> Previous disabled, Next disabled.
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 5,
  currentParams = {},
  forcedState = null,
}) {
  // Determine effective pagination variables based on whether a state is forced
  let effectivePage = currentPage;
  let effectiveTotalPages = totalPages;
  let hasPrev = false;
  let hasNext = false;
  let activeStateLabel = "";

  if (forcedState === "first") {
    effectivePage = 1;
    effectiveTotalPages = 4;
    hasPrev = false;
    hasNext = true;
    activeStateLabel = "State 1: First Page (Prev Disabled, Next Active) [FORCED]";
  } else if (forcedState === "middle") {
    effectivePage = 2;
    effectiveTotalPages = 4;
    hasPrev = true;
    hasNext = true;
    activeStateLabel = "State 2: Middle Page (Both Active) [FORCED]";
  } else if (forcedState === "last") {
    effectivePage = 4;
    effectiveTotalPages = 4;
    hasPrev = true;
    hasNext = false;
    activeStateLabel = "State 3: Last Page (Prev Active, Next Disabled) [FORCED]";
  } else if (forcedState === "single") {
    effectivePage = 1;
    effectiveTotalPages = 1;
    hasPrev = false;
    hasNext = false;
    activeStateLabel = "State 4: Single Page (Both Disabled) [FORCED]";
  } else {
    // Dynamic live states
    hasPrev = effectivePage > 1;
    hasNext = effectivePage < effectiveTotalPages;

    if (effectiveTotalPages <= 1) {
      activeStateLabel = "State 4: Single Page (Both Disabled)";
    } else if (effectivePage === 1) {
      activeStateLabel = "State 1: First Page (Prev Disabled, Next Active)";
    } else if (effectivePage === effectiveTotalPages) {
      activeStateLabel = "State 3: Last Page (Prev Active, Next Disabled)";
    } else {
      activeStateLabel = "State 2: Middle Page (Both Active)";
    }
  }

  // Helper to generate href preserving all current searchParams
  const buildPageHref = (targetPage) => {
    const params = new URLSearchParams();
    Object.entries(currentParams).forEach(([k, v]) => {
      if (k !== "page" && k !== "forcedState" && v !== undefined && v !== null) {
        params.set(k, String(v));
      }
    });
    params.set("page", String(targetPage));
    return `/dashboard?${params.toString()}`;
  };

  const buildForceHref = (stateKey) => {
    const params = new URLSearchParams();
    Object.entries(currentParams).forEach(([k, v]) => {
      if (k !== "page" && k !== "forcedState" && v !== undefined && v !== null) {
        params.set(k, String(v));
      }
    });
    if (stateKey) {
      params.set("forcedState", stateKey);
    }
    return `/dashboard?${params.toString()}`;
  };

  return (
    <div className="space-y-4 pt-4 border-t border-stone-200">
      {/* Interactive Toolbar to write and force each of the four states */}
      <div className="bg-stone-50 p-3 sm:p-4 rounded-xl border border-stone-200 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <span className="font-semibold text-stone-700">
            Exercise 7 — Force Each of the Four States:
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-200/70 text-stone-800 font-mono text-[11px] font-semibold">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            {activeStateLabel}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={buildForceHref("first")}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
              forcedState === "first"
                ? "bg-orange-600 text-white shadow-xs"
                : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-100"
            }`}
          >
            1. First Page
          </Link>
          <Link
            href={buildForceHref("middle")}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
              forcedState === "middle"
                ? "bg-orange-600 text-white shadow-xs"
                : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-100"
            }`}
          >
            2. Middle Page
          </Link>
          <Link
            href={buildForceHref("last")}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
              forcedState === "last"
                ? "bg-orange-600 text-white shadow-xs"
                : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-100"
            }`}
          >
            3. Last Page
          </Link>
          <Link
            href={buildForceHref("single")}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
              forcedState === "single"
                ? "bg-orange-600 text-white shadow-xs"
                : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-100"
            }`}
          >
            4. Single Page
          </Link>
          {forcedState && (
            <Link
              href={buildForceHref(null)}
              className="px-2.5 py-1.5 rounded-lg font-medium bg-stone-200 hover:bg-stone-300 text-stone-800 transition-colors"
            >
              Reset to Live
            </Link>
          )}
        </div>
      </div>

      {/* Main Paging Navigation with Link Elements */}
      <nav
        aria-label="Order table pagination navigation"
        className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
      >
        <div className="text-xs text-stone-500">
          Showing page <span className="font-bold text-stone-800">{effectivePage}</span> of{" "}
          <span className="font-bold text-stone-800">{effectiveTotalPages}</span>
          {!forcedState && totalItems > 0 && (
            <span> ({totalItems} total orders, {pageSize} per page)</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Previous Page Link / Disabled span */}
          {hasPrev ? (
            <Link
              href={buildPageHref(effectivePage - 1)}
              className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-medium transition-colors shadow-xs"
              aria-label="Go to previous page"
            >
              &larr; Previous
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-100 text-stone-400 font-medium cursor-not-allowed select-none"
            >
              &larr; Previous
            </span>
          )}

          {/* Numeric Page Links (with active state indicator) */}
          <div className="flex items-center gap-1">
            {Array.from({ length: effectiveTotalPages }, (_, i) => i + 1).map((p) => {
              const isCurrent = p === effectivePage;
              return isCurrent ? (
                <span
                  key={p}
                  aria-current="page"
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-600 text-white font-bold text-xs shadow-xs"
                >
                  {p}
                </span>
              ) : (
                <Link
                  key={p}
                  href={buildPageHref(p)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium transition-colors"
                  aria-label={`Go to page ${p}`}
                >
                  {p}
                </Link>
              );
            })}
          </div>

          {/* Next Page Link / Disabled span */}
          {hasNext ? (
            <Link
              href={buildPageHref(effectivePage + 1)}
              className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-medium transition-colors shadow-xs"
              aria-label="Go to next page"
            >
              Next &rarr;
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-100 text-stone-400 font-medium cursor-not-allowed select-none"
            >
              Next &rarr;
            </span>
          )}
        </div>
      </nav>
    </div>
  );
}
