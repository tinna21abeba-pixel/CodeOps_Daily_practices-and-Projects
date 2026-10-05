import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/app/lib/session";
import { getOrdersByUserId } from "@/app/lib/orders";
import { cancelOrder } from "@/app/actions/orders";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/sign-in?next=/orders");
  }

  const userOrders = getOrdersByUserId(session.user.id);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">My Orders</h1>
          <p className="text-xs text-stone-500 mt-1">
            Account: <span className="font-semibold text-stone-800">{session.user.name}</span> (ID: <span className="font-mono">{session.user.id}</span>)
          </p>
        </div>
        <Link
          href="/checkout"
          className="text-xs font-semibold px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          New Order
        </Link>
      </div>

      {userOrders.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center">
          <p className="text-stone-500 text-sm">No orders found for this account.</p>
          <Link href="/menu" className="mt-3 inline-block text-xs font-semibold text-orange-600 underline">
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-stone-500">#{order.id}</span>
                  <span className="text-sm font-bold text-stone-900">{order.food}</span>
                  <span className="text-xs text-stone-500">x{order.quantity}</span>
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  Delivery to: {order.deliveryArea} | Phone: {order.phone}
                </p>
                <p className="text-xs text-stone-400 mt-0.5">
                  Placed: {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Cancelled"
                      ? "bg-stone-100 text-stone-500"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {order.status}
                </span>

                {order.status === "Pending" && (
                  <form
                    action={async () => {
                      "use server";
                      await cancelOrder(order.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="text-xs px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
