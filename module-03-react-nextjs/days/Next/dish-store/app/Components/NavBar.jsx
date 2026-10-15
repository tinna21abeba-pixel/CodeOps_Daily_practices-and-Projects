import Link from "next/link";

export default function NavBar() {
  return (
    <nav aria-label="Main Navigation" className="flex items-center gap-2 text-sm font-medium text-stone-700 flex-wrap">
      <Link
        href="/"
        className="min-h-[44px] px-3 py-2 inline-flex items-center rounded-lg hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-colors"
      >
        Home
      </Link>
      <Link
        href="/menu"
        className="min-h-[44px] px-3 py-2 inline-flex items-center rounded-lg hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-colors"
      >
        Menu
      </Link>
      <Link
        href="/cart"
        className="min-h-[44px] px-3 py-2 inline-flex items-center rounded-lg hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-colors"
      >
        Cart
      </Link>
      <Link
        href="/checkout"
        className="min-h-[44px] px-3 py-2 inline-flex items-center rounded-lg hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-colors"
      >
        Checkout
      </Link>
      <Link
        href="/orders"
        className="min-h-[44px] px-3 py-2 inline-flex items-center rounded-lg hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-colors"
      >
        Orders
      </Link>
      <Link
        href="/dashboard"
        className="min-h-[44px] px-3 py-2 inline-flex items-center rounded-lg hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-colors"
      >
        Dashboard
      </Link>
      <Link
        href="/kitchen"
        className="min-h-[44px] px-3 py-2 inline-flex items-center rounded-lg hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-colors"
      >
        Kitchen
      </Link>
      <Link
        href="/order-search"
        className="min-h-[44px] px-3 py-2 inline-flex items-center rounded-lg hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-colors"
      >
        Search Orders
      </Link>
      <Link
        href="/sign-in"
        className="min-h-[44px] px-3 py-2 inline-flex items-center rounded-lg hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 transition-colors font-semibold text-orange-600"
      >
        Account
      </Link>
    </nav>
  );
}