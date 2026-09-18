import dishes from "../../data/dishes";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function DishDetails({ params }) {
  const { id } = await params;

  const dish = dishes.find((dish) => dish.id.toString() === id);

  if (!dish) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-4xl w-full bg-zinc-900 rounded-2xl shadow-xl overflow-hidden md:flex">
        {/* Image Placeholder */}
        <div className="md:w-1/2 h-72 bg-zinc-800 flex items-center justify-center">
          <span className="text-8xl">🍽️</span>
        </div>

        {/* Details */}
        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <span className="inline-block bg-amber-500 text-white px-4 py-1 rounded-full text-sm mb-4">
              {dish.category}
            </span>

            <h1 className="text-4xl font-bold mb-4">
              {dish.name}
            </h1>

            <p className="text-zinc-300 leading-7 mb-6">
              {dish.description}
            </p>

            <h2 className="text-3xl font-bold text-amber-500">
              {dish.price} ETB
            </h2>
          </div>

          <div className="mt-8 flex gap-4">
            <button className="flex-1 bg-amber-500 hover:bg-amber-600 transition py-3 rounded-lg font-semibold">
              Add to Cart
            </button>

            <Link
              href="/menu"
              className="flex-1 text-center bg-zinc-700 hover:bg-zinc-600 transition py-3 rounded-lg font-semibold"
            >
              Back
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}