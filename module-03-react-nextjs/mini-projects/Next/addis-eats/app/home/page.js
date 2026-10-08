import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Welcome",
  description: "Experience the authentic taste of Ethiopian cuisine with our curated selection of traditional culinary specialties.",
  alternates: {
    canonical: "/home",
  },
  openGraph: {
    title: "Welcome | Addis Eats",
    description: "Experience the authentic taste of Ethiopian cuisine with our curated selection of traditional culinary specialties.",
    url: "/home",
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold text-white mb-4">Welcome to Addis Eats</h1>
      <Image
        src="https://typicalethiopian.com/wp-content/uploads/2022/02/8.-raw-meat.jpg"
        alt="Authentic Ethiopian culinary platter"
        width={800}
        height={450}
        sizes="(max-width: 768px) 100vw, 800px"
        className="rounded-2xl max-w-xl w-full h-64 object-cover mb-6 border border-zinc-800 shadow-xl"
      />
      <p className="text-zinc-300 max-w-lg mb-6">
        Experience the authentic taste of Ethiopian cuisine with our curated selection of traditional dishes.
      </p>
      <Link
        href="/menu"
        className="inline-block bg-amber-500 hover:bg-amber-600 transition px-6 py-3 rounded-xl font-semibold text-white"
      >
        View Menu
      </Link>
    </main>
  );
}