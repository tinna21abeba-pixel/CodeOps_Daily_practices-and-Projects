import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/app/lib/session";
import { getOrders } from "@/app/lib/orders";

export const dynamic = "force-dynamic";

export default async function KitchenPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in?next=/kitchen");
  }

  if (session.user.role !== "staff") {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <div className="bg-white p-8 rounded-2xl border border-red-200 shadow-sm">
          <p className="text-xs font-mono font-bold uppercase text-red-500 tracking-wider">
            403 Forbidden
          </p>
          <h1 className="text-2xl font-bold text-stone-900 mt-2">
            Access Denied
          </h1>
          <p className="text-sm text-stone-600 mt-2">
            This route is restricted to staff members only. Your current role is{" "}
            <span className="font-mono font-bold text-stone-900">{session.user.role}</span>.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/orders"
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-medium rounded-lg transition-colors"
            >
              Go to My Orders
            </Link>
            <Link
              href="/sign-in?next=/kitchen"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Sign In as Staff
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const allOrders = getOrders();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Kitchen Display Board</h1>
          <p className="text-xs text-stone-500 mt-1">
            Logged in as <span className="font-semibold text-stone-800">{session.user.name}</span> (Role: <span className="font-mono font-bold text-orange-600 uppercase">{session.user.role}</span>)
          </p>
        </div>
        <span className="text-xs font-mono bg-stone-100 px-3 py-1 rounded-full text-stone-700 border border-stone-200">
          Total orders: {allOrders.length}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {allOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-stone-500">Order #{order.id}</span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Cancelled"
                      ? "bg-stone-100 text-stone-500"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <h2 className="text-lg font-bold text-stone-900">{order.food}</h2>
              <p className="text-xs text-stone-600 mt-1">Quantity: {order.quantity}</p>
              <p className="text-xs text-stone-600 mt-0.5">Customer: {order.customerName} ({order.phone})</p>
              <p className="text-xs text-stone-600 mt-0.5">Area: {order.deliveryArea}</p>
              <p className="text-xs text-stone-400 mt-2 font-mono">User ID: {order.userId}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
