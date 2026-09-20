import Link from "next/link";
import { cookies } from "next/headers";

// Dynamic rendering required: reading cart session cookies and headers per request
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  await cookies();

  return (
    <div className="min-h-[calc(100vh-130px)] bg-zinc-950 text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full bg-zinc-900 p-8 rounded-2xl shadow-xl text-center border border-zinc-800">
        <h1 className="text-4xl font-bold mb-4 text-amber-500">Checkout</h1>
        <p className="text-zinc-300 mb-8">
          Complete your order to enjoy delicious Ethiopian food.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/menu"
            className="bg-amber-500 hover:bg-amber-600 transition px-6 py-3 rounded-lg font-semibold text-white"
          >
            Back to Menu
          </Link>
          <Link
            href="/cart"
            className="bg-zinc-700 hover:bg-zinc-600 transition px-6 py-3 rounded-lg font-semibold text-white"
          >
            View Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
