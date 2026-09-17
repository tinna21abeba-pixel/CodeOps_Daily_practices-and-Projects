import Link from "next/link";
import dishes from "../data/Dishes";

export default function DishList({ selectedCategory }) {
  const filteredDishes =
    selectedCategory === "all"
      ? dishes
      : dishes.filter(
          (dish) => dish.category === selectedCategory
        );

  return (
    <section>
      <h2>Our Dishes</h2>

      {filteredDishes.map((dish) => (
        <article key={dish.id}>
          <h3>{dish.name}</h3>

          <p>Category: {dish.category}</p>

          <p>{dish.description}</p>

          <p>{dish.price} ETB</p>

          <Link href={`/menu/${dish.id}`}>
            View Details
          </Link>
        </article>
      ))}
    </section>
  );
}