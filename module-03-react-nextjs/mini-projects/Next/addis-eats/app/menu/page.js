import { Suspense } from "react";
import dishes from "../data/dishes";
import FilterShell from "./FilterShell";
import DishList from "./DishList";

export const revalidate = 60;

function MenuSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-56 bg-zinc-900 rounded-2xl p-6 space-y-4">
            <div className="h-6 bg-zinc-800 rounded w-3/4" />
            <div className="h-4 bg-zinc-800 rounded w-full" />
            <div className="h-4 bg-zinc-800 rounded w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function MenuPage({ searchParams }) {
  const params = await searchParams;
  const selectedCategory = params?.category || "All";
  const categories = ["All", ...new Set(dishes.map((dish) => dish.category))];

  return (
    <FilterShell selectedCategory={selectedCategory} categories={categories}>
      <Suspense fallback={<MenuSkeleton />}>
        <DishList selectedCategory={selectedCategory} />
      </Suspense>
    </FilterShell>
  );
}