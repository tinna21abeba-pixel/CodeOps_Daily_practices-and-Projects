import { listOrders, listOrdersByUser, findOrder } from "@/app/lib/store";
import { ordersToCsv } from "@/lib/csv";
import { getSession } from "@/app/lib/session";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const session = await getSession();

  let orders;
  if (id) {
    const order = findOrder(id);
    orders = order ? [order] : [];
  } else if (session?.userId && session.user?.role !== "staff") {
    orders = listOrdersByUser(session.userId);
    if (orders.length === 0) {
      orders = listOrders();
    }
  } else {
    orders = listOrders();
  }

  const csv = ordersToCsv(orders);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${id ? `order-${id}.csv` : "orders.csv"}"`,
    },
  });
}
