import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Habesha Restaurant</h1>

      <p>
        Welcome to Habesha Restaurant.
      </p>

      <p>
        Enjoy authentic Ethiopian dishes made with
        traditional ingredients and spices.
      </p>

      <Link href="/menu">
        Explore Our Menu
      </Link>
    </main>
  );
}