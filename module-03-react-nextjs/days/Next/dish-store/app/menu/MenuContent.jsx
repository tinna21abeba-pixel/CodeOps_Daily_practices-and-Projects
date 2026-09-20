"use client";

import { useState } from "react";
import Link from "next/link";
import CategoryBar from "./CategoryBar";
import DishList from "./DishList";

export default function MenuContent() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <h1 className="text-2xl font-bold text-stone-900">
          Habesha Restaurant
        </h1>

        <Link
          href="/"
          className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
        >
          &larr; Home
        </Link>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm lg:hidden">
        <CategoryBar
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </div>

      <DishList selectedCategory={selectedCategory} />
    </div>
  );
}