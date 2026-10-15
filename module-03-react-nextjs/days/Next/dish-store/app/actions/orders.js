"use server";

import { revalidatePath } from "next/cache";
import { orderSchema } from "@/app/lib/validations";
import {
  addOrder,
  findOrder,
  cancelOrderById,
  getOrders,
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

  if (!session?.user) {
    return {
      fieldErrors: {},
      message: "Unauthorized. Please sign in to create an order.",
    };
  }

  const now = Date.now();
  const recentOrders = getOrders();
  const duplicate = recentOrders.find((existing) => {
    const isSameUser = existing.userId === session.user.id;
    const isSameFood = existing.food === result.data.food;
    const isSameQuantity = Number(existing.quantity) === Number(result.data.quantity);
    const isSameCustomer = existing.customerName === result.data.customerName;
    const createdTime = new Date(existing.createdAt).getTime();
    return isSameUser && isSameFood && isSameQuantity && isSameCustomer && Math.abs(now - createdTime) < 3000;
  });

  if (duplicate) {
    return {
      fieldErrors: {},
      message: "Order placed successfully.",
    };
  }

  const order = {
    id: now,
    userId: session.user.id,
    status: "Pending",
    createdAt: new Date(now).toISOString(),
    ...result.data,
  };

  addOrder(order);

  revalidatePath("/checkout");
  revalidatePath("/orders");
  revalidatePath("/dashboard");

  return {
    fieldErrors: {},
    message: "Order placed successfully.",
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

  revalidatePath("/checkout");
  revalidatePath("/orders");
  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Order cancelled successfully.",
  };
}