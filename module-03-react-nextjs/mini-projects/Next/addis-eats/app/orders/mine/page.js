import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "../../lib/session";
import { listOrdersByUser, toOwnerOrder } from "../../lib/store";
import CancelOrderButton from "../CancelOrderButton";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "My Orders",
  description: "Track your active orders and review your complete Ethiopian food delivery order history.",
  alternates: {
    canonical: "/orders/mine",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function MyOrdersPage() {
  const session = await getSession();

  if (!session?.userId) {
    redirect("/sign-in?next=/orders/mine");
  }

  const orders = listOrdersByUser(session.userId).map(toOwnerOrder);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-zinc-800 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-500">My Orders</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Account: <span className="font-semibold text-zinc-200">{session.user?.name}</span> (ID: <span className="font-mono">{session.userId}</span>)
          </p>
        </div>
        <Link
          href="/menu"
          className="text-xs font-semibold px-4 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 rounded-xl transition font-bold"
        >
          Browse Menu
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
          <p className="text-zinc-400">
            You have no orders yet.{" "}
            <Link href="/menu" className="text-amber-500 underline font-medium">Browse the menu</Link>
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((o) => (
            <li key={o.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between gap-4 items-start">
                <div>
                  <div className="flex items-center gap-3">
                    <Link href={`/orders/${o.id}`} className="font-bold text-lg text-white hover:text-amber-400 underline">
                      {o.id}
                    </Link>
                    <span className="text-xs text-zinc-500">
                      {new Date(o.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-zinc-300 text-sm mt-2">
                    {o.items.map((i) => `${i.quantity} x ${i.name}`).join(", ")}
                  </p>
                  <p className="text-zinc-500 text-xs mt-1">Delivery address: {o.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-amber-500 font-bold text-lg">{o.total} ETB</p>
                  <span
                    className={`inline-block text-xs px-2.5 py-0.5 rounded-full font-medium mt-1 ${
                      o.status === "delivered"
                        ? "bg-emerald-950 border border-emerald-800 text-emerald-400"
                        : o.status === "cancelled"
                        ? "bg-zinc-800 text-zinc-400"
                        : "bg-amber-950 border border-amber-800 text-amber-400"
                    }`}
                  >
                    {o.status}
                  </span>
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
