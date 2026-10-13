import { listOrders } from "@/app/lib/store";
import { ordersToCsv } from "@/lib/csv";

export const dynamic = "force-dynamic";

export async function GET() {
  const orders = listOrders();
  const csv = ordersToCsv(orders);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="orders.csv"',
    },
  });
}
