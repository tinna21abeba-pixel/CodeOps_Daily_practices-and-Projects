"use client";

import { Suspense } from "react";
import CategoryBar from "./CategoryBar";

export default function MenuContent({
  selectedCategory,
  children,
}) {
  return (
    <div className="flex flex-col gap-5">

      <CategoryBar
        selectedCategory={selectedCategory}
      />

      <Suspense fallback={<p>Loading dishes...</p>}>
        {children}
      </Suspense>

    </div>
  );
}