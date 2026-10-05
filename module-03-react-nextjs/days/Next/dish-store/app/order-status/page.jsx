import { findOrder } from "@/app/lib/orders";
import OrderStatus from "./OrderStatus";

export default async function OrderStatusPage({ searchParams }) {
  const { id } = await searchParams;

  const order = await findOrder(Number(id));

  return (
    <OrderStatus
      orderId={id}
      initialOrder={order}
    />
  );
}