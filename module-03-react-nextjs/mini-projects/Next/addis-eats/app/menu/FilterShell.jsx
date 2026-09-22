"use client";

import Link from "next/link";

export default function FilterShell({
  selectedCategory = "All",
  categories = [],
  children,
}) {
  return (
    <div className="flex flex-col gap-8">
      <section className="text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
          Our Menu
        </h1>
        <p className="text-zinc-400 text-sm mb-6">
          Explore authentic flavors crafted with traditional Ethiopian recipes
        </p>

        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <Link
                key={category}
                href={
                  category === "All" ? "/menu" : `/menu?category=${category}`
                }
                scroll={false}
                className={`px-5 py-2 rounded-full text-sm font-medium transition duration-200 ${
                  isActive
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/25"
                    : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
                }`}
              >
                {category}
              </Link>
            );
          })}
        </div>
      </section>

      <div>{children}</div>
    </div>
  );
}
