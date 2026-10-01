import Link from "next/link";
import { getSession } from "../../lib/session";
import { listOrdersByUser, toOwnerOrder } from "../../lib/store";
import CancelOrderButton from "../CancelOrderButton";

export default async function MyOrdersPage() {
  const session = await getSession();
  const orders = session ? listOrdersByUser(session.userId).map(toOwnerOrder) : [];

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-white">
      <h1 className="text-3xl font-bold text-amber-500 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-zinc-400">
          You have no orders yet.{" "}
          <Link href="/menu" className="text-amber-500 underline">Browse the menu</Link>
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((o) => (
            <li key={o.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
              <div className="flex justify-between gap-4">
                <div>
                  <p className="font-bold">{o.id}</p>
                  <p className="text-zinc-400 text-sm">
                    {o.items.map((i) => `${i.quantity} x ${i.name}`).join(", ")}
                  </p>
                  <p className="text-zinc-500 text-xs mt-1">{o.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-amber-500 font-bold">{o.total} ETB</p>
                  <p className={o.status === "cancelled" ? "text-red-400 text-sm" : "text-green-400 text-sm"}>
                    {o.status}
                  </p>
                </div>
              </div>
              {o.status === "pending" && <CancelOrderButton orderId={o.id} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}