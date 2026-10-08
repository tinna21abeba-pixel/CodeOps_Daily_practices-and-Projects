import { redirect } from "next/navigation";
import { getSession } from "../lib/session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Orders",
  description: "Redirecting to your Addis Eats orders dashboard.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function OrdersPage() {
  const session = await getSession();

  if (!session?.userId) {
    redirect("/sign-in?next=/orders");
  }

  if (session.user?.role === "staff") {
    redirect("/staff");
  }

  redirect("/orders/mine");
}
