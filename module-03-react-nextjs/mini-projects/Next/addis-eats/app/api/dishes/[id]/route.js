import { findDish } from "../../../lib/store";
import { notFound } from "../../../lib/api";

export async function GET(_request, { params }) {
  const { id } = await params;

  const dish = /^\d+$/.test(id) ? findDish(id) : undefined;
  if (!dish) return notFound("Dish");

  return Response.json({ dish });
}