import { submitOrder } from "../../lib/orders";
import { errorResponse } from "../../lib/api";
import { getSession } from "../../lib/session";

export async function POST(request) {
  const session = await getSession();
  if (!session?.userId) {
    return errorResponse(401, "UNAUTHENTICATED", "Unauthorized. Please sign in.");
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "INVALID_JSON", "Request body must be valid JSON.");
  }

  const result = await submitOrder(body);
  if (!result.ok) {
    return errorResponse(result.status, result.code, result.message, result.fieldErrors);
  }
  return Response.json({ order: result.order }, { status: result.status });
}