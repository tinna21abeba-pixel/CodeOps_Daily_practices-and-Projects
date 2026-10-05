"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import DishList from "./DishList";
import useDebounce from "../hooks/useDebounce";
import { useDishes, useDishSearch } from "../hooks/useDishes";

function pageHref(category, page) {
  const p = new URLSearchParams();
  if (category !== "All") p.set("category", category);
  if (page > 1) p.set("page", String(page));
  const qs = p.toString();
  return qs ? `/menu?${qs}` : "/menu";
}


function Pager({ category, page }) {
  const { data } = useDishes({ category, page });
  if (!data || data.totalPages <= 1) return null;

  return (
    <nav className="flex justify-center items-center gap-4 mt-10 text-sm">
      {page > 1 ? (
        <Link href={pageHref(category, page - 1)} scroll={false} className="text-amber-500 hover:underline">
          ← Previous
        </Link>
      ) : (
        <span className="text-zinc-600">← Previous</span>
      )}
      <span className="text-zinc-400">
        Page {data.page} of {data.totalPages} · {data.total} dishes
      </span>
      {page < data.totalPages ? (
        <Link href={pageHref(category, page + 1)} scroll={false} className="text-amber-500 hover:underline">
          Next →
        </Link>
      ) : (
        <span className="text-zinc-600">Next →</span>
      )}
    </nav>
  );
}

export default function MenuBrowser({ selectedCategory = "All" }) {
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  const [term, setTerm] = useState("");
  const debounced = useDebounce(term, 400);
  const searching = debounced.trim().length > 0;

  const list = useDishes({ category: selectedCategory, page });
  const search = useDishSearch(debounced);


  const active = searching ? search : list;
  const dishes = active.data?.dishes;

  return (
    <div>
      <input
        type="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search dishes..."
        className="w-full max-w-md mx-auto block mb-8 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
      />

      {active.error && (
        <p className="text-red-400 text-sm text-center mb-4">{active.error.message}</p>
      )}

      {!dishes && active.isLoading && (
        <p className="text-zinc-500 text-center">Loading dishes...</p>
      )}

      {dishes && (
        <div className={active.isValidating ? "opacity-60 transition-opacity" : "transition-opacity"}>
          {dishes.length === 0 ? (
            <p className="text-zinc-400 text-center">No dishes match &quot;{debounced}&quot;.</p>
          ) : (
            <DishList dishes={dishes} />
          )}
        </div>
      )}

      {!searching && <Pager category={selectedCategory} page={page} />}
    </div>
  );
}