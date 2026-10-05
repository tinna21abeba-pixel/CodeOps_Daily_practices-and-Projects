import { notFound } from "next/navigation";
import { findOrder, toPublicOrder } from "../../lib/store";
import OrderStatus from "./OrderStatus";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }) {
  const { id } = await params;
  const order = findOrder(id);
  if (!order) notFound();

  return (
    <div className="max-w-xl mx-auto px-6 py-12 text-white">
      <h1 className="text-3xl font-bold text-amber-500 mb-6">Order {id}</h1>
      <OrderStatus id={id} initialOrder={toPublicOrder(order)} />
    </div>
  );
}
