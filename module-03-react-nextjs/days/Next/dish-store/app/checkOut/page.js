import { cookies } from "next/headers";

export default async function CheckOutPage() {
  const cookieStore = await cookies();
  const user = cookieStore.get("user");

  return (
    <div>
      <h1>Checkout</h1>

      <p>
        User: {user?.value ?? "guest"}
      </p>
    </div>
  );
}