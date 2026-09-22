import Link from "next/link";
import dishes from "../data/dishes";
import AddToCartButton from "./AddToCartButton";

export default function DishList({ selectedCategory = "All" }) {
  const filteredDishes =
    selectedCategory === "All"
      ? dishes
      : dishes.filter((dish) => dish.category === selectedCategory);

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {filteredDishes.map((dish) => (
        <div
          key={dish.id}
          className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
        >
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-2xl font-bold text-white">
                {dish.name}
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {dish.category}
              </span>
            </div>

            <p className="text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3">
              {dish.description}
            </p>

            <div className="mt-auto pt-4 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-amber-500 text-xl font-bold">
                {dish.price} ETB
              </span>
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                href={`/menu/${dish.id}`}
                className="flex-1 text-center bg-zinc-800 text-zinc-200 py-2 rounded-lg font-semibold hover:bg-zinc-700 transition text-sm flex items-center justify-center"
              >
                View Details
              </Link>
              <AddToCartButton dish={dish} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}