import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center text-center py-12 md:py-20 px-4">
      <div className="max-w-lg w-full bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
        <h1 className="text-orange-600 font-bold text-3xl mb-4">Habesha Restaurant</h1>

        <p className="text-stone-800 font-medium text-lg mb-2">
          Welcome to Habesha Restaurant.
        </p>

        <Image
          src="/images/homePage.png"
          alt="Habesha Restaurant Ethiopian Feast"
          width={1200}
          height={600}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          className="w-full h-64 object-cover rounded-xl mb-6 shadow-sm"
        />

        <p className="text-stone-600 text-sm leading-relaxed mb-6">
          Enjoy authentic Ethiopian dishes made with traditional ingredients and spices.
        </p>

        <Link
          href="/menu"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          Explore Our Menu
        </Link>
      </div>
    </section>
  );
}