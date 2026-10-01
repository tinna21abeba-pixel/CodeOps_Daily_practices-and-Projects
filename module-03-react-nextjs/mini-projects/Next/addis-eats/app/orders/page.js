import Link from "next/link";
import { listOrders, toPublicOrder } from "../lib/store";


export default function OrdersBoardPage() {
  const orders = listOrders().map(toPublicOrder);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-white">
      <h1 className="text-3xl font-bold text-amber-500 mb-2">Kitchen Board</h1>
      <p className="text-zinc-400 mb-8 text-sm">
        All recent orders (no personal details shown).{" "}
        <Link href="/orders/mine" className="text-amber-500 underline">See my orders</Link>
      </p>

      {orders.length === 0 ? (
        <p className="text-zinc-500">No orders yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((o) => (
            <li key={o.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex justify-between gap-4">
              <div>
                <p className="font-bold">{o.id}</p>
                <p className="text-zinc-400 text-sm">
                  {o.items.map((i) => `${i.quantity} x ${i.name}`).join(", ")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-amber-500 font-bold">{o.total} ETB</p>
                <p className={o.status === "cancelled" ? "text-red-400 text-sm" : "text-green-400 text-sm"}>
                  {o.status}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}