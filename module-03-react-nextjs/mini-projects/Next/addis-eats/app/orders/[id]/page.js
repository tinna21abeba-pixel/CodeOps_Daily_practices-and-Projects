import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { findOrder, toPublicOrder } from "../../lib/store";
import { getSession } from "../../lib/session";
import OrderStatus from "./OrderStatus";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }) {
  const { id } = await params;
  const session = await getSession();

  if (!session?.userId) {
    redirect(`/sign-in?next=/orders/${id}`);
  }

  const order = findOrder(id);
  if (!order) notFound();

  if (order.userId !== session.userId && session.user?.role !== "staff") {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center text-white">
        <div className="bg-zinc-900 border border-red-500/50 p-8 rounded-2xl shadow-xl">
          <p className="text-xs font-mono font-bold uppercase text-red-400 tracking-wider">
            403 Forbidden
          </p>
          <h1 className="text-2xl font-bold text-white mt-2">
            Access Denied
          </h1>
          <p className="text-sm text-zinc-400 mt-3">
            You do not have permission to view order <span className="font-mono text-amber-400">{id}</span>. This order belongs to another account.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/orders/mine"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-sm rounded-xl transition"
            >
              Go to My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12 text-white">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-3xl font-bold text-amber-500">Order {id}</h1>
          <p className="text-xs text-zinc-400 mt-1">Customer: {order.name}</p>
        </div>
        <Link
          href="/orders/mine"
          className="text-xs text-amber-400 hover:text-amber-300 underline font-medium"
        >
          Back to My Orders
        </Link>
      </div>
      <OrderStatus id={id} initialOrder={toPublicOrder(order)} />
    </div>
  );
}
