import { NextResponse } from "next/server";
import { orderSchema } from "@/app/lib/validations";
import { getOrders, addOrder } from "@/app/lib/orders";

export async function GET(request) {
  const search = request.nextUrl.searchParams.get("search") || "";
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1", 10);
  const limit = 3;

  const allOrders = getOrders();
  const filtered = search
    ? allOrders.filter((order) =>
        order.customerName.toLowerCase().includes(search.toLowerCase())
      )
    : allOrders;

  const startIndex = (page - 1) * limit;
  const orders = filtered.slice(startIndex, startIndex + limit);
  const hasNextPage = startIndex + limit < filtered.length;

  return NextResponse.json({
    orders,
    hasNextPage,
    page,
    total: filtered.length,
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const result = orderSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          fieldErrors: result.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const order = {
      id: Date.now(),
      status: "Pending",
      createdAt: new Date().toISOString(),
      ...result.data,
    };

    addOrder(order);

    return NextResponse.json(
      {
        message: "Order created successfully",
        order,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        error: "Invalid JSON body",
      },
      { status: 400 }
    );
  }
}