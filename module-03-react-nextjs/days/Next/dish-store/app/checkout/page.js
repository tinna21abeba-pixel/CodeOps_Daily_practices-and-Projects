"use client";

import { useActionState, useState, useEffect, useRef } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    setIsSubmitting(false);
  }, [state]);

  const handleSubmit = () => {
    if (pending || isSubmitting) {
      return;
    }
    setIsSubmitting(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      if (document.activeElement && typeof document.activeElement.blur === "function") {
        document.activeElement.blur();
      }
    }
  };

  const isPending = pending || isSubmitting;

  return (
    <div className="max-w-xl mx-auto py-6" onKeyDown={handleKeyDown}>
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
        <h1 className="text-2xl font-bold mb-6 text-stone-900 text-center">
          Checkout
        </h1>

        <form ref={formRef} action={formAction} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="customerName" className="block text-xs font-semibold text-stone-700 uppercase mb-1">
              Customer Name
            </label>
            <input
              id="customerName"
              name="customerName"
              placeholder="Enter your name"
              required
              className="w-full min-h-[44px] px-4 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-stone-900 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            />
            {state.fieldErrors?.customerName && (
              <p className="text-red-500 text-xs mt-1">{state.fieldErrors.customerName[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-semibold text-stone-700 uppercase mb-1">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              placeholder="Enter phone number"
              required
              className="w-full min-h-[44px] px-4 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-stone-900 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            />
            {state.fieldErrors?.phone && (
              <p className="text-red-500 text-xs mt-1">{state.fieldErrors.phone[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="food" className="block text-xs font-semibold text-stone-700 uppercase mb-1">
              Food
            </label>
            <input
              id="food"
              name="food"
              placeholder="Enter food name"
              required
              className="w-full min-h-[44px] px-4 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-stone-900 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            />
            {state.fieldErrors?.food && (
              <p className="text-red-500 text-xs mt-1">{state.fieldErrors.food[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="quantity" className="block text-xs font-semibold text-stone-700 uppercase mb-1">
              Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              defaultValue="1"
              required
              className="w-full min-h-[44px] px-4 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-stone-900 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            />
            {state.fieldErrors?.quantity && (
              <p className="text-red-500 text-xs mt-1">{state.fieldErrors.quantity[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="deliveryArea" className="block text-xs font-semibold text-stone-700 uppercase mb-1">
              Delivery Area
            </label>
            <input
              id="deliveryArea"
              name="deliveryArea"
              placeholder="Enter delivery area"
              required
              className="w-full min-h-[44px] px-4 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-stone-900 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            />
            {state.fieldErrors?.deliveryArea && (
              <p className="text-red-500 text-xs mt-1">{state.fieldErrors.deliveryArea[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-xs font-semibold text-stone-700 uppercase mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Special instructions"
              rows={3}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-stone-900 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            aria-busy={isPending ? "true" : "false"}
            className="w-full min-h-[44px] px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold rounded-lg shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:cursor-not-allowed text-sm inline-flex items-center justify-center"
          >
            {isPending ? "Placing Order..." : "Place Order"}
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