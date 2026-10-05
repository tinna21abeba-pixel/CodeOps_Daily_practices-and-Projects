"use server";

import { redirect } from "next/navigation";
import { createSession, deleteSession, sanitizeNextUrl } from "../lib/session";
import { getUserById } from "../lib/users";

export async function signIn(formData) {
  const accountId = String(formData.get("accountId") || "user-1");
  const rawNext = String(formData.get("next") || "/orders/mine");

  const user = getUserById(accountId) || {
    id: accountId,
    name: "Customer",
    role: "customer",
  };

  await createSession(user);

  const safeNext = sanitizeNextUrl(rawNext);
  redirect(safeNext);
}

export async function signOut() {
  await deleteSession();
  redirect("/sign-in");
}
