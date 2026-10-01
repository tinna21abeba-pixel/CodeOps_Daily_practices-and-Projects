import { z } from "zod";

export const orderSchema = z.object({
  customerName: z
    .string()
    .min(2, "Customer name must be at least 2 characters"),

  phone: z
    .string()
    .min(9, "Phone number must be at least 9 characters"),

  food: z
    .string()
    .min(1, "Please select a food"),

  quantity: z
    .number()
    .int()
    .positive("Quantity must be greater than 0"),

  deliveryArea: z
    .string()
    .min(2, "Delivery area is required"),

  notes: z
    .string()
    .optional(),
});