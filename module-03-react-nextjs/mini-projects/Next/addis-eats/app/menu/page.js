import { Suspense } from "react";
import MenuContent from "./MenuContent";

export const revalidate = 60;

async function DishListStream() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return <MenuContent />;
}

function MenuSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-zinc-800 rounded w-48 mx-auto" />
      <div className="flex justify-center gap-3">
        <div className="h-10 w-20 bg-zinc-800 rounded-full" />
        <div className="h-10 w-24 bg-zinc-800 rounded-full" />
        <div className="h-10 w-24 bg-zinc-800 rounded-full" />
      </div>
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

export default function MenuPage() {
  return (
    <Suspense fallback={<MenuSkeleton />}>
      <DishListStream />
    </Suspense>
  );
}