import dishes from "@/app/data/Dishes";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return dishes.map((dish) => ({
    id: String(dish.id),
  }));
}

export default async function DishDetails({ params }) {
  const { id } = await params;

  const dish = dishes.find(
    (dish) => String(dish.id) === String(id)
  );

  if (!dish) {
    notFound();
  }

  return (
    <main className="max-w-xl mx-auto py-4">
      <h1 className="text-xl font-bold text-stone-900 mb-4">
        Dish Details
      </h1>

      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
          <h2 className="text-2xl font-bold text-stone-900">
            {dish.name}
          </h2>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
            {dish.category}
          </span>
        </div>

        {dish.image && (
          <Image
            src={dish.image}
            alt={dish.name}
            width={800}
            height={450}
            sizes="(max-width: 768px) 100vw, 600px"
            className="w-full h-64 object-cover rounded-xl mb-6 shadow-sm"
          />
        )}

        <p className="text-stone-600 text-sm leading-relaxed mb-6">
          {dish.description}
        </p>

        <div className="pt-3 border-t border-stone-100 flex items-baseline justify-between">
          <span className="text-xs uppercase font-semibold text-stone-400">
            Price
          </span>

          <span className="text-2xl font-bold text-orange-600">
            {dish.price}{" "}
            <span className="text-sm font-medium text-stone-500">
              ETB
            </span>
          </span>
        </div>
      </div>

      <Link
        href="/menu"
        className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
      >
        Back to Menu
      </Link>
    </main>
  );
}