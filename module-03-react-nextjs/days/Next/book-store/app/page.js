import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-row text-center m-20  justify-center gap-2">
      <h1 className="text-orange-500  font-bold text-2xl justify-center">Habesha Restaurant</h1>

      <p>
        Welcome to Habesha Restaurant.
      </p>

      <p>
        Enjoy authentic Ethiopian dishes made with
        traditional ingredients and spices.
      </p>

      <Link href="/menu" className="bg-orange-500 text-white  p-2 rounded-lg ">
        Explore Our Menu
      </Link>
    </main>
  );
}