import { findOrder, toPublicOrder } from "../../../lib/store";
import { notFound, errorResponse } from "../../../lib/api";
import { getSession } from "../../../lib/session";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const session = await getSession();
  if (!session?.userId) {
    return errorResponse(401, "UNAUTHENTICATED", "Unauthorized. Please sign in.");
  }

  const { id } = await params;
  const order = findOrder(id);
  if (!order) return notFound("Order");

  if (order.userId !== session.userId && session.user?.role !== "staff") {
    return errorResponse(403, "FORBIDDEN", "Forbidden. You do not have permission to view this order.");
  }

  return Response.json({ order: toPublicOrder(order) });
}