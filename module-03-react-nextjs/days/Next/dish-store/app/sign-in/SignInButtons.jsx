"use client";

import { useFormStatus } from "react-dom";

export function AccountSubmitButton({ name, id, role }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending ? "true" : "false"}
      className="w-full min-h-[44px] text-left p-3.5 border border-stone-200 hover:border-orange-400 hover:bg-orange-50/40 rounded-xl transition-all flex items-center justify-between focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div>
        <p className="text-sm font-semibold text-stone-900">{name}</p>
        <p className="text-xs text-stone-500">ID: {id} | Role: {role}</p>
      </div>
      <span className="text-xs font-semibold text-orange-600">
        {pending ? "Signing in..." : "Sign in"}
      </span>
    </button>
  );
}

export function SignOutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending ? "true" : "false"}
      className="w-full min-h-[44px] py-2.5 px-4 bg-stone-200 hover:bg-stone-300 text-stone-800 text-sm font-medium rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-600 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
    >
      {pending ? "Signing out..." : "Sign Out"}
    </button>
  );
}
