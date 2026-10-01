import { listDishes } from "../../lib/store";

export async function GET(request) {
  const category = request.nextUrl.searchParams.get("category");
  return Response.json({ dishes: listDishes(category) });
}