import { submitOrder } from "../../lib/orders";
import { errorResponse } from "../../lib/api";

export async function POST(request) {
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