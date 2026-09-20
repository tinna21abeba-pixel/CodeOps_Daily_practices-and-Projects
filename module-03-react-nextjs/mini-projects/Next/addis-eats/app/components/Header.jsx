import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-900/90 backdrop-blur px-6 py-4 flex items-center justify-between">
      <div className="text-xl font-bold text-amber-500">
        <Link href="/">Addis Eats</Link>
      </div>
      <nav className="flex items-center gap-6 text-sm font-medium text-zinc-300">
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
      </nav>
    </header>
  );
}