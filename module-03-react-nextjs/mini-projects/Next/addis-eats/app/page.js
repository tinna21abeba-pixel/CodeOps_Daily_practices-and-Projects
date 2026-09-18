import Link from "next/link";

export default async function HomePage() {
  await new Promise((resolve) => setTimeout(resolve, 100));

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-6">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
          Welcome to
          <span className="block text-amber-500">Addis Eats</span>
        </h1>

        <p className="text-zinc-300 text-lg md:text-xl mb-10">
          Discover authentic Ethiopian cuisine prepared with tradition,
          passion, and fresh ingredients.
        </p>

        <Link
          href="/menu"
          className="inline-block bg-amber-500 hover:bg-amber-600 transition px-8 py-4 rounded-full text-lg font-semibold text-white shadow-lg"
        >
          View Our Menu
        </Link>
      </div>
    </main>
  );
}