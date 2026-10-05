import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="flex items-center gap-5 text-sm font-medium text-stone-700 flex-wrap">
      <Link href="/" className="hover:text-orange-600 transition-colors">
        Home
      </Link>
      <Link href="/menu" className="hover:text-orange-600 transition-colors">
        Menu
      </Link>
      <Link href="/cart" className="hover:text-orange-600 transition-colors">
        Cart
      </Link>
      <Link href="/checkout" className="hover:text-orange-600 transition-colors">
        Checkout
      </Link>
      <Link href="/orders" className="hover:text-orange-600 transition-colors">
        Orders
      </Link>
      <Link href="/kitchen" className="hover:text-orange-600 transition-colors">
        Kitchen
      </Link>
      <Link href="/order-search" className="hover:text-orange-600 transition-colors">
        Search Orders
      </Link>
      <Link href="/sign-in" className="hover:text-orange-600 transition-colors font-semibold text-orange-600">
        Account
      </Link>
    </nav>
  );
}