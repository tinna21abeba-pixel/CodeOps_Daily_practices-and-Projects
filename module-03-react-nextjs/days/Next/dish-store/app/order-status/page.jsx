import { findOrder } from "@/app/lib/orders";
import OrderStatus from "./OrderStatus";

export default async function OrderStatusPage({ searchParams }) {
  const params = await searchParams;
  const id = params?.id;
  const order = id ? await findOrder(Number(id)) : null;

  return (
    <OrderStatus
      orderId={id}
      initialOrder={order}
    />
  );
}