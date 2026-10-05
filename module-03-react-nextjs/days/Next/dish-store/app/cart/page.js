import CartView from "./CartView";

export default function CartPage() {
  return (
    <div className="max-w-xl mx-auto py-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
        <h1 className="text-2xl font-bold mb-6 text-stone-900 text-center">
          Your Cart
        </h1>
        <CartView />
      </div>
    </div>
  );
}
