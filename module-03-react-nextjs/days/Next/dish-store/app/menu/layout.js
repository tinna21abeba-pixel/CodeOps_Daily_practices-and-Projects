import { Suspense } from "react";
import CategoryBar from "./CategoryBar";
import MenuCounter from "./MenuCounter";

export default function MenuLayout({ children }) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
        <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
          <Suspense fallback={null}>
            <CategoryBar />
          </Suspense>
        </div>

        <MenuCounter />
      </aside>

      <section className="flex-1 w-full min-w-0">{children}</section>
    </div>
  );
}

