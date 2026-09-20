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
      <h2 className="text-center">Categories</h2>

      <div className="flex flex-col  text-orange-300 p-4 m-2 gap-5">
        {uniqueCategories.map((category) => (
          <button 
          
            key={category}
            onClick={() => handleChange(category)}
            className={
              selectedCategory === category
                ? "active"
                : ""
            }
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  );
}