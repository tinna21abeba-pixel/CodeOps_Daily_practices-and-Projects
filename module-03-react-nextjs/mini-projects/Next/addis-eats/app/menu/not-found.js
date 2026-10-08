import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto py-16 px-6 text-center text-white">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-amber-500 mb-4">Dish Not Found</h1>
        <p className="text-zinc-300 text-sm mb-6">
          The requested Ethiopian dish could not be found in our kitchen records.
        </p>
        <Link
          href="/menu"
          className="inline-block px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-sm rounded-xl transition"
        >
          Back to Menu
        </Link>
      </div>
    </div>
  );
}