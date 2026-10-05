"use server";

import { submitOrder, cancelOrderForSession } from "../lib/orders";
import { getSession } from "../lib/session";
import { findOrder } from "../lib/store";

export async function placeOrder(_prevState, formData) {
  const session = await getSession();
  if (!session?.userId) {
    return {
      ok: false,
      message: "Unauthorized. Please sign in to place an order.",
      fieldErrors: {},
      values: null,
    };
  }

  const values = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    address: String(formData.get("address") ?? ""),
    note: String(formData.get("note") ?? ""),
  };

  let items = [];
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    items = [];
  }

  const result = await submitOrder({ ...values, note: values.note || undefined, items });

  if (!result.ok) {
    return { ok: false, message: result.message, fieldErrors: result.fieldErrors, values };
  }
  return { ok: true, orderId: result.order.id, values: null };
}

export async function cancelOrder(_prevState, formData) {
  const session = await getSession();
  if (!session?.userId) {
    return { ok: false, message: "Unauthorized. Please sign in." };
  }

  const rawId = formData && typeof formData.get === "function" ? formData.get("orderId") : formData;
  const orderId = String(rawId || "");

  const order = findOrder(orderId);
  if (!order) {
    return { ok: false, message: "Order not found." };
  }

  if (order.userId !== session.userId && session.user?.role !== "staff") {
    return { ok: false, message: "Forbidden. You can only cancel your own orders." };
  }

  const result = await cancelOrderForSession(orderId);
  return result.ok
    ? { ok: true, message: "Order cancelled." }
    : { ok: false, message: result.message };
}