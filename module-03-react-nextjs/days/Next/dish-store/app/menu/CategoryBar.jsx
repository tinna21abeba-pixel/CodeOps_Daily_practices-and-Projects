import dishes from "../data/Dishes";
import Link from "next/link";

export default function CategoryBar({ selectedCategory }) {
  const uniqueCategories = [
    "all",
    ...new Set(dishes.map((dish) => dish.category)),
  ];

  return (
    <section>
      <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
        Categories
      </h2>

      <div className="flex flex-wrap lg:flex-col gap-2">
        {uniqueCategories.map((category) => (
          <Link
            key={category}
            href={`/menu?category=${category}`}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium capitalize text-left transition-all cursor-pointer ${
              selectedCategory === category
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-stone-100 hover:bg-stone-200 text-stone-700"
            }`}
          >
            {category}
          </Link>
        ))}
      </div>
    </section>
  );
}
