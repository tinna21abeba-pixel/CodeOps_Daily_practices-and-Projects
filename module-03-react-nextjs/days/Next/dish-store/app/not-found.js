import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-white border border-stone-200 rounded-2xl p-8 max-w-md w-full shadow-sm">
        <span className="text-4xl font-extrabold text-orange-500 mb-2 block">404</span>
        <h1 className="text-xl font-bold text-stone-900 mb-2">Page Not Found</h1>
        <p className="text-sm text-stone-600 mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}