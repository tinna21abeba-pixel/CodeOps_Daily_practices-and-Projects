import { NextResponse } from "next/server";
import { orderSchema } from "@/app/lib/validations";

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
      ...result.data,
      createdAt: new Date().toISOString(),
    };

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