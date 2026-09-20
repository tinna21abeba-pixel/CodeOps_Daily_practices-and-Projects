import Link from "next/link";

export default function CartPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full bg-zinc-900 p-8 rounded-2xl shadow-xl text-center">
        <h1 className="text-4xl font-bold mb-4 text-amber-500">Your Cart</h1>
        <p className="text-zinc-300 mb-8">
          Your shopping cart is currently empty.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/menu"
            className="bg-amber-500 hover:bg-amber-600 transition px-6 py-3 rounded-lg font-semibold text-white"
          >
            Browse Menu
          </Link>
          <Link
            href="/checkout"
            className="bg-zinc-700 hover:bg-zinc-600 transition px-6 py-3 rounded-lg font-semibold text-white"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}
