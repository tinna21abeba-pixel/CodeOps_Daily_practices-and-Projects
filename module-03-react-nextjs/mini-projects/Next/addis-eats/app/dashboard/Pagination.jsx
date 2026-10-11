import Link from "next/link";

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 5,
  currentParams = {},
  forcedState = null,
}) {
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
    <div className="space-y-4 pt-4 border-t border-zinc-800">
      <div className="bg-zinc-950 p-3 sm:p-4 rounded-xl border border-zinc-800 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          <span className="font-semibold text-zinc-300">
            Pagination States Demonstration:
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 text-amber-400 font-mono text-[11px] font-semibold border border-zinc-700">
            {activeStateLabel}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={buildForceHref("first")}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
              forcedState === "first"
                ? "bg-amber-500 text-zinc-950 font-bold"
                : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800"
            }`}
          >
            1. First Page
          </Link>
          <Link
            href={buildForceHref("middle")}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
              forcedState === "middle"
                ? "bg-amber-500 text-zinc-950 font-bold"
                : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800"
            }`}
          >
            2. Middle Page
          </Link>
          <Link
            href={buildForceHref("last")}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
              forcedState === "last"
                ? "bg-amber-500 text-zinc-950 font-bold"
                : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800"
            }`}
          >
            3. Last Page
          </Link>
          <Link
            href={buildForceHref("single")}
            className={`px-2.5 py-1.5 rounded-lg font-medium transition ${
              forcedState === "single"
                ? "bg-amber-500 text-zinc-950 font-bold"
                : "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800"
            }`}
          >
            4. Single Page
          </Link>
          {forcedState && (
            <Link
              href={buildForceHref(null)}
              className="px-2.5 py-1.5 rounded-lg font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
            >
              Reset to Live
            </Link>
          )}
        </div>
      </div>

      <nav
        aria-label="Order table pagination navigation"
        className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
      >
        <div className="text-xs text-zinc-400">
          Showing page <span className="font-bold text-white">{effectivePage}</span> of{" "}
          <span className="font-bold text-white">{effectiveTotalPages}</span>
          {!forcedState && totalItems > 0 && (
            <span> ({totalItems} total orders, {pageSize} per page)</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {hasPrev ? (
            <Link
              href={buildPageHref(effectivePage - 1)}
              className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-medium transition shadow-sm"
              aria-label="Go to previous page"
            >
              Previous
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-600 font-medium cursor-not-allowed select-none"
            >
              Previous
            </span>
          )}

          <div className="flex items-center gap-1">
            {Array.from({ length: effectiveTotalPages }, (_, i) => i + 1).map((p) => {
              const isCurrent = p === effectivePage;
              return isCurrent ? (
                <span
                  key={p}
                  aria-current="page"
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-amber-500 text-zinc-950 font-bold text-xs"
                >
                  {p}
                </span>
              ) : (
                <Link
                  key={p}
                  href={buildPageHref(p)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition"
                  aria-label={`Go to page ${p}`}
                >
                  {p}
                </Link>
              );
            })}
          </div>

          {hasNext ? (
            <Link
              href={buildPageHref(effectivePage + 1)}
              className="px-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-medium transition shadow-sm"
              aria-label="Go to next page"
            >
              Next
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-600 font-medium cursor-not-allowed select-none"
            >
              Next
            </span>
          )}
        </div>
      </nav>
    </div>
  );
}
