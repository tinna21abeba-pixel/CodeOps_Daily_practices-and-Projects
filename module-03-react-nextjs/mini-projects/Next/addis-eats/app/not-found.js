import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist on Addis Eats.",
};

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto py-16 px-6 text-center text-white">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-amber-500 mb-4">Page Not Found</h1>
        <p className="text-zinc-300 text-sm mb-6">
          The requested page could not be found on Addis Eats.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-sm rounded-xl transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
