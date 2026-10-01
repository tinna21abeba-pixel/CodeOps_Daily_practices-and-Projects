import { cookies } from "next/headers";
import CheckoutForm from "./CheckoutForm";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  await cookies();

  return (
    <div className="min-h-[calc(100vh-130px)] bg-zinc-950 text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-800">
        <h1 className="text-4xl font-bold mb-2 text-amber-500 text-center">Checkout</h1>
        <p className="text-zinc-300 mb-8 text-center">
          Complete your order to enjoy delicious Ethiopian food.
        </p>
        <CheckoutForm />
      </div>
    </div>
  );
}