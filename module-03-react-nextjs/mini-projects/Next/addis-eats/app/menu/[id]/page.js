import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import dishes from "../../data/dishes";
import AddToCartButton from "../AddToCartButton";

export async function generateStaticParams() {
  return dishes.map((dish) => ({
    id: dish.id.toString(),
  }));
}

export default async function DishDetails({ params }) {
  const { id } = await params;

  const dish = dishes.find((dish) => dish.id.toString() === id);

  if (!dish) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto flex items-center justify-center py-6">
      <div className="w-full bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-zinc-800 p-8">
        <span className="inline-block bg-amber-500 text-white px-4 py-1 rounded-full text-sm mb-4 font-semibold">
          {dish.category}
        </span>

        <h1 className="text-4xl font-bold mb-4 text-white">
          {dish.name}
        </h1>

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

        <p className="text-zinc-300 leading-7 mb-6">
          {dish.description}
        </p>

        <h2 className="text-3xl font-bold text-amber-500 mb-8">
          {dish.price} ETB
        </h2>

        <div className="flex gap-4">
          <AddToCartButton
            dish={dish}
            className="flex-1 py-3 rounded-lg font-semibold text-white transition bg-amber-500 hover:bg-amber-600 text-center"
          />

          <Link
            href="/menu"
            className="flex-1 text-center bg-zinc-800 hover:bg-zinc-700 transition py-3 rounded-lg font-semibold text-white border border-zinc-700"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}