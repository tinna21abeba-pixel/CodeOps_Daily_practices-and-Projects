import CartView from "./CartView";

export const metadata = {
  title: "Your Cart",
  description: "Review your selected Ethiopian dishes, adjust order quantities, and proceed to checkout.",
  alternates: {
    canonical: "/cart",
  },
  openGraph: {
    title: "Your Cart | Addis Eats",
    description: "Review your selected Ethiopian dishes, adjust order quantities, and proceed to checkout.",
    url: "/cart",
  },
};

export default function CartPage() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-800">
        <h1 className="text-3xl font-bold mb-6 text-amber-500 text-center">
          Your Cart
        </h1>
        <CartView />
      </div>
    </main>
  );
}
