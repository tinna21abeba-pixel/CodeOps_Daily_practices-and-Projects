import { z } from "zod";


const ETHIOPIAN_PHONE = /^(?:\+251|251|0)[79]\d{8}$/;

export const orderItemSchema = z.object({
  dishId: z.number().int().positive(),
  quantity: z.number().int().min(1, "Minimum 1").max(20, "Maximum 20 per dish"),
});

export const orderSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(80),
  phone: z
    .string()
    .trim()
    .regex(
      ETHIOPIAN_PHONE,
      "Enter a valid Ethiopian phone number, e.g. 0911234567 or +251911234567"
    ),
  address: z.string().trim().min(5, "Please enter a delivery address").max(200),
  note: z.string().trim().max(200, "Note is too long").optional(),
  items: z.array(orderItemSchema).min(1, "Your cart is empty"),
});


export function parseOrder(input) {
  const result = orderSchema.safeParse(input);
  if (result.success) return { ok: true, data: result.data };
  return { ok: false, fieldErrors: z.flattenError(result.error).fieldErrors };
}