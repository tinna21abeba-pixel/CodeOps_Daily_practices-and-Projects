"use client";

import { useActionState } from "react";
import { createOrder } from "@/app/actions/orders";

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
    <div className="max-w-xl mx-auto py-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
        <h1 className="text-2xl font-bold mb-6 text-stone-900 text-center">
          Checkout
        </h1>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
              Customer Name
            </label>
            <input
              name="customerName"
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-stone-900 text-sm"
            />
            {state.fieldErrors?.customerName && (
              <p className="text-red-500 text-xs mt-1">{state.fieldErrors.customerName[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
              Phone Number
            </label>
            <input
              name="phone"
              placeholder="Enter phone number"
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-stone-900 text-sm"
            />
            {state.fieldErrors?.phone && (
              <p className="text-red-500 text-xs mt-1">{state.fieldErrors.phone[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
              Food
            </label>
            <input
              name="food"
              placeholder="e.g. Doro Wat, Tibs"
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-stone-900 text-sm"
            />
            {state.fieldErrors?.food && (
              <p className="text-red-500 text-xs mt-1">{state.fieldErrors.food[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
              Quantity
            </label>
            <input
              name="quantity"
              type="number"
              min="1"
              defaultValue="1"
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-stone-900 text-sm"
            />
            {state.fieldErrors?.quantity && (
              <p className="text-red-500 text-xs mt-1">{state.fieldErrors.quantity[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
              Delivery Area
            </label>
            <input
              name="deliveryArea"
              placeholder="e.g. Bole, Kazanchis"
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-stone-900 text-sm"
            />
            {state.fieldErrors?.deliveryArea && (
              <p className="text-red-500 text-xs mt-1">{state.fieldErrors.deliveryArea[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              placeholder="Special instructions (optional)"
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-stone-900 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold rounded-lg shadow-sm transition-colors cursor-pointer disabled:cursor-not-allowed text-sm"
          >
            {pending ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        {state.message && (
          <p className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg text-center">
            {state.message}
          </p>
        )}
      </div>
    </div>
  );
}