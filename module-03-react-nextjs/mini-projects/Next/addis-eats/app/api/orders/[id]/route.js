import { findOrder, toPublicOrder } from "../../../lib/store";
import { notFound } from "../../../lib/api";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { id } = await params;
  const order = findOrder(id);
  if (!order) return notFound("Order");
  return Response.json({ order: toPublicOrder(order) });
}