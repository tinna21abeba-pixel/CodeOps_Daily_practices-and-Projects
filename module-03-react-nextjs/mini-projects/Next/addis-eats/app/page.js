import Image from "next/image";
import Link from "next/link";

export default async function HomePage() {
  await new Promise((resolve) => setTimeout(resolve, 100));

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center px-6 py-12">
      <div className="max-w-3xl text-center flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
          Welcome to
          <span className="block text-amber-500">Addis Eats</span>
        </h1>

        <Image
          src="https://typicalethiopian.com/wp-content/uploads/2022/02/8.-raw-meat.jpg"
          alt="Traditional Ethiopian feast with authentic dishes"
          width={1200}
          height={600}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          className="w-full h-72 md:h-96 object-cover rounded-2xl mb-8 border border-zinc-800 shadow-2xl"
        />

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