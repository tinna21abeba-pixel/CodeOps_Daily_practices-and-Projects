"use client";

import dishes from "../data/Dishes";

export default function CategoryBar({
  selectedCategory,
  setSelectedCategory,
}) {
  const uniqueCategories = [
    "all",
    ...new Set(dishes.map((dish) => dish.category)),
  ];

  function handleChange(category) {
    setSelectedCategory(category);
  }

  return (
    <section>
      <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
        Categories
      </h2>

      <div className="flex flex-wrap lg:flex-col gap-2">
        {uniqueCategories.map((category) => (
          <button
            key={category}
            onClick={() => handleChange(category)}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium capitalize text-left transition-all cursor-pointer ${
              selectedCategory === category
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-stone-100 hover:bg-stone-200 text-stone-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}