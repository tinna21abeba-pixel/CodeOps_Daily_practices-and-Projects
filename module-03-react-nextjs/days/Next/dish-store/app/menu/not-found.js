import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-8 text-center max-w-md mx-auto my-8 shadow-sm">
      <h2 className="text-xl font-bold text-stone-900 mb-2">Item Not Found</h2>
      <p className="text-sm text-stone-600 mb-6">
        Sorry, the dish or page you are looking for does not exist.
      </p>
      <Link
        href="/menu"
        className="min-h-[44px] px-5 py-2.5 inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
      >
        Back to Menu
      </Link>
    </div>
  );
}