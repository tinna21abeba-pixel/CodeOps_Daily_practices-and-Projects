"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession, sanitizeNextUrl } from "@/app/lib/session";

const USERS = {
  "user-1": {
    id: "user-1",
    name: "Tehesh",
    role: "customer",
  },
  "user-2": {
    id: "user-2",
    name: "Abebe",
    role: "customer",
  },
  "staff-1": {
    id: "staff-1",
    name: "Chef Sara",
    role: "staff",
  },
};

export async function signIn(formData) {
  const accountId = formData.get("accountId") || "user-1";
  const rawNext = formData.get("next") || "/orders";

  const user = USERS[accountId] || {
    id: accountId,
    name: formData.get("name") || "User",
    role: formData.get("role") || "customer",
  };

  await createSession(user);

  const safeNext = sanitizeNextUrl(rawNext);
  redirect(safeNext);
}

export async function signOut() {
  await deleteSession();
  redirect("/sign-in");
}
