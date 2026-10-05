import { queryDishes } from "../../lib/store";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const sp = request.nextUrl.searchParams;
  const pageParam = Number(sp.get("page"));
  const sizeParam = Number(sp.get("pageSize"));

  const result = queryDishes({
    category: sp.get("category"),
    q: sp.get("q"),
    page: Number.isInteger(pageParam) && pageParam > 0 ? pageParam : undefined,
    pageSize: Number.isInteger(sizeParam) && sizeParam > 0 ? Math.min(sizeParam, 50) : 4,
  });

  return Response.json(result);
}