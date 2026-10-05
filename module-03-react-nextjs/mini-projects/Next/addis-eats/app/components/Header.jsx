import Link from "next/link";
import { getSession } from "../lib/session";
import { signOut } from "../actions/auth";

export default async function Header() {
  const session = await getSession();

  return (
    <header className="border-b border-zinc-800 bg-zinc-900/90 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-between gap-4">
      <div className="text-xl font-bold text-amber-500">
        <Link href="/">Addis Eats</Link>
      </div>

      <nav className="flex flex-wrap items-center gap-6 text-sm font-medium text-zinc-300">
        <Link href="/" className="hover:text-amber-500 transition-colors">
          Home
        </Link>
        <Link href="/menu" className="hover:text-amber-500 transition-colors">
          Menu
        </Link>
        <Link href="/cart" className="hover:text-amber-500 transition-colors">
          Cart
        </Link>
        <Link href="/checkout" className="hover:text-amber-500 transition-colors">
          Checkout
        </Link>
        <Link href="/orders/mine" className="hover:text-amber-500 transition-colors">
          My Orders
        </Link>
        {session?.user?.role === "staff" ? (
          <Link href="/staff" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors">
            Staff Board
          </Link>
        ) : null}
      </nav>

      <div className="flex items-center gap-3">
        {session?.user ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400">
              {session.user.name} <span className="text-amber-400 font-mono uppercase text-[10px]">({session.user.role})</span>
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-lg transition font-medium"
              >
                Sign Out
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/sign-in"
            className="text-xs bg-amber-500 hover:bg-amber-600 text-zinc-950 px-3 py-1.5 rounded-lg font-bold transition"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}