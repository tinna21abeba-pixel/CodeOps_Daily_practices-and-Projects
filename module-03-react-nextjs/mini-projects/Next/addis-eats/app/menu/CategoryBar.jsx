"use client"
import dishes from "../data/dishes";
export default function CategoryBar({
    selectedCategory,
    setSelectedCategory,
}) {
    const uniqueCategories = [
        "All",
        ...new Set(dishes.map((dish) => dish.category))
    ]

    function handleChange(category) {
        setSelectedCategory(category);
    }

    return (
  <section className="mb-10">
    <h2 className="text-3xl font-bold text-center mb-6">
      Categories
    </h2>

    <div className="flex flex-wrap justify-center gap-4">
      {uniqueCategories.map((category) => (
        <button
          key={category}
          onClick={() => handleChange(category)}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
            selectedCategory === category
              ? "bg-amber-500 text-white"
              : "bg-zinc-800 text-zinc-300 hover:bg-amber-500 hover:text-white"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  </section>
);
}
