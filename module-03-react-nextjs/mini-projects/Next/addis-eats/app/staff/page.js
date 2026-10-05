import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "../lib/session";
import { listOrders } from "../lib/store";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const session = await getSession();

  if (!session?.userId) {
    redirect("/sign-in?next=/staff");
  }

  if (session.user?.role !== "staff") {
    return (
      <div className="max-w-xl mx-auto py-16 px-6 text-center text-white">
        <div className="bg-zinc-900 border border-red-500/50 p-8 rounded-2xl shadow-xl">
          <p className="text-xs font-mono font-bold uppercase text-red-400 tracking-wider">
            403 Forbidden
          </p>
          <h1 className="text-3xl font-bold text-white mt-2">
            Access Denied
          </h1>
          <p className="text-sm text-zinc-400 mt-3">
            This route is restricted to staff members only. Your current role is{" "}
            <span className="font-mono font-bold text-amber-400">{session.user?.role || "unknown"}</span>.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/orders/mine"
              className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-xl transition"
            >
              My Orders
            </Link>
            <Link
              href="/sign-in?next=/staff"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-sm rounded-xl transition"
            >
              Sign In as Staff
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const allOrders = listOrders();

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 text-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-zinc-800 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-500">Staff Kitchen Board</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Logged in as <span className="font-semibold text-zinc-200">{session.user?.name}</span> (Role: <span className="font-mono font-bold text-amber-400 uppercase">{session.user?.role}</span>)
          </p>
        </div>
        <div className="text-sm text-zinc-400 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl">
          Total Orders: <span className="font-bold text-amber-500">{allOrders.length}</span>
        </div>
      </div>

      {allOrders.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center text-zinc-400">
          No orders received yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {allOrders.map((order) => (
            <div
              key={order.id}
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-amber-400">{order.id}</span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      order.status === "delivered"
                        ? "bg-emerald-950 border border-emerald-800 text-emerald-400"
                        : order.status === "cancelled"
                        ? "bg-zinc-800 text-zinc-400"
                        : "bg-amber-950 border border-amber-800 text-amber-400"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">Customer: {order.name}</p>
                  <p className="text-xs text-zinc-400">Phone: {order.phone}</p>
                  <p className="text-xs text-zinc-400">Address: {order.address}</p>
                  {order.note ? (
                    <p className="text-xs text-amber-200/80 italic">Note: {order.note}</p>
                  ) : null}
                </div>
                <div className="mt-4 pt-3 border-t border-zinc-800/80">
                  <p className="text-xs font-semibold text-zinc-400 mb-1">Items:</p>
                  <ul className="text-xs text-zinc-300 space-y-1">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{item.quantity} x {item.name}</span>
                        <span>{item.price * item.quantity} ETB</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between items-center">
                <span className="text-xs font-mono text-zinc-500">User: {order.userId}</span>
                <span className="text-sm font-bold text-amber-500">{order.total} ETB</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
