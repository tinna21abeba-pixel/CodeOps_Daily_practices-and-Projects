import Link from "next/link";
import dishes from "../data/Dishes";

export default function DishList({ selectedCategory }) {
  const filteredDishes =
    selectedCategory === "all"
      ? dishes
      : dishes.filter(
          (dish) => dish.category === selectedCategory
        );

  function handleAddToCart(dish) {
    const cart = [];
    if (cart.length > 0) {
      const cartItem = cart.find((item) => item.id === dish.id);
      if (cartItem) {
        cartItem.quantity += 1;
      } else {
        cart.push(dish);
      }
    } else {
      cart.push(dish);
    }
  }

  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredDishes.map((dish) => (
          <article
            key={dish.id}
            className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-base text-stone-900">{dish.name}</h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 shrink-0">
                  {dish.category}
                </span>
              </div>

              <p className="text-stone-600 text-xs leading-relaxed mb-4">
                {dish.description}
              </p>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between mt-auto">
              <span className="text-base font-bold text-orange-600">
                {dish.price} <span className="text-xs font-normal text-stone-500">ETB</span>
              </span>

              <Link
                href={`/menu/${dish.id}`}
                className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
              >
                View Details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}