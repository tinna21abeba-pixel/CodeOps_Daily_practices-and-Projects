"use server";

import { revalidatePath } from "next/cache";
import { orderSchema } from "@/app/lib/validations";
import {
  addOrder,
  findOrder,
  cancelOrderById,
} from "@/app/lib/orders";
import { getSession } from "@/app/lib/session";

export async function createOrder(prevState, formData) {
  const data = {
    customerName: formData.get("customerName"),
    phone: formData.get("phone"),
    food: formData.get("food"),
    quantity: Number(formData.get("quantity")),
    deliveryArea: formData.get("deliveryArea"),
    notes: formData.get("notes") || "",
  };

  const result = orderSchema.safeParse(data);

  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors,
      message: "",
    };
  }

  const session = await getSession();

  const order = {
    id: Date.now(),
    userId: session.user.id,
    status: "Pending",
    createdAt: new Date().toISOString(),
    ...result.data,
  };

  addOrder(order);

  revalidatePath("/checkOut");

  return {
    fieldErrors: {},
    message: "Order created successfully!",
  };
}

export async function cancelOrder(orderId) {
  const session = await getSession();

  if (!session?.user) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  const order = findOrder(orderId);

  if (!order) {
    return {
      success: false,
      message: "Order not found",
    };
  }

  if (order.userId !== session.user.id) {
    return {
      success: false,
      message: "Forbidden",
    };
  }

  cancelOrderById(orderId);

  revalidatePath("/checkOut");

  return {
    success: true,
    message: "Order cancelled successfully.",
  };
}