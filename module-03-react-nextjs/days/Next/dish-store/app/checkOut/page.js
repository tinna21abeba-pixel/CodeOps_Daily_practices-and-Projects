"use client";

import { useActionState } from "react";
import {createOrder} from "@/app/actions/orders";

const initialState = {
  fieldErrors: {},
  message: "",
};

export default function CheckOutPage() {
  const [state, formAction, pending] = useActionState(
    createOrder,
    initialState
  );

  return (
    <div>
      <h1>Checkout</h1>

      <form action={formAction}>
        <input
          name="customerName"
          placeholder="Customer name"
        />
        {state.fieldErrors?.customerName && (
          <p>{state.fieldErrors.customerName[0]}</p>
        )}

        <input
          name="phone"
          placeholder="Phone"
        />
        {state.fieldErrors?.phone && (
          <p>{state.fieldErrors.phone[0]}</p>
        )}

        <input
          name="food"
          placeholder="Food"
        />
        {state.fieldErrors?.food && (
          <p>{state.fieldErrors.food[0]}</p>
        )}

        <input
          name="quantity"
          type="number"
          min="1"
          defaultValue="1"
        />
        {state.fieldErrors?.quantity && (
          <p>{state.fieldErrors.quantity[0]}</p>
        )}

        <input
          name="deliveryArea"
          placeholder="Delivery area"
        />
        {state.fieldErrors?.deliveryArea && (
          <p>{state.fieldErrors.deliveryArea[0]}</p>
        )}

        <textarea
          name="notes"
          placeholder="Notes"
        />

        <button type="submit" disabled={pending}>
          {pending ? "Placing Order..." : "Place Order"}
        </button>
      </form>

      {state.message && <p>{state.message}</p>}
    </div>
  );
}