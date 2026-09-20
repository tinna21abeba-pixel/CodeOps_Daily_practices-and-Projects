import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="flex items-center gap-5 text-sm font-medium text-stone-700">
      <Link href="/" className="hover:text-orange-600 transition-colors">
        Home
      </Link>
      <Link href="/menu" className="hover:text-orange-600 transition-colors">
        Menu
      </Link>
      <Link href="/cart" className="hover:text-orange-600 transition-colors">
        Cart
      </Link>
      <Link href="/checkOut" className="hover:text-orange-600 transition-colors">
        Checkout
      </Link>
    </nav>
  );
}