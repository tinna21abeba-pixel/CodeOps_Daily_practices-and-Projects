"use server";

import { submitOrder, cancelOrderForSession } from "../lib/orders";

export async function placeOrder(_prevState, formData) {
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
  const result = await cancelOrderForSession(formData.get("orderId"));
  return result.ok
    ? { ok: true, message: "Order cancelled." }
    : { ok: false, message: result.message };
}