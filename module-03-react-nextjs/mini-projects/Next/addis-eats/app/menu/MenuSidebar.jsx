import Link from "next/link";
import dishes from "../data/dishes";
import MenuCounter from "./MenuCounter";

export default function MenuSidebar() {
  return (
    <aside className="w-full md:w-64 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 p-6 flex flex-col gap-6 shrink-0">
      <div>
        <h2 className="text-lg font-bold text-amber-500 mb-2">
          Menu Navigation
        </h2>
        <nav className="flex flex-col gap-1">
          <Link
            href="/menu"
            className="text-zinc-300 hover:text-amber-500 transition py-1 text-sm font-medium"
          >
            All Dishes
          </Link>
          <div className="text-xs uppercase text-zinc-500 font-semibold tracking-wider mt-3 mb-1">
            Quick Links
          </div>
          {dishes.slice(0, 6).map((dish) => (
            <Link
              key={dish.id}
              href={`/menu/${dish.id}`}
              className="text-zinc-400 hover:text-amber-400 transition py-1 text-sm truncate"
            >
              {dish.name}
            </Link>
          ))}
        </nav>
      </div>

      <MenuCounter />
    </aside>
  );
}
