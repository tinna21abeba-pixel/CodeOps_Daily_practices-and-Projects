import { redirect } from "next/navigation";
import { getSession } from "../lib/session";
import CheckoutForm from "./CheckoutForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout",
  description: "Complete your Ethiopian food order with delivery details and contact information.",
  alternates: {
    canonical: "/checkout",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CheckoutPage() {
  const session = await getSession();

  if (!session?.userId) {
    redirect("/sign-in?next=/checkout");
  }

  return (
    <div className="min-h-[calc(100vh-130px)] bg-zinc-950 text-white flex items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-800">
        <h1 className="text-4xl font-bold mb-2 text-amber-500 text-center">Checkout</h1>
        <p className="text-zinc-300 mb-8 text-center text-sm">
          Signed in as <span className="font-semibold text-white">{session.user?.name}</span> ({session.user?.role})
        </p>
        <CheckoutForm/>
      </div>
    </div>
  );
}