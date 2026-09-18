import Link from "next/link";
export default function Home(){
    return (
         <main>
      <h1>Welcome to Addis Eats</h1>
      <p>
        Experience the authentic taste of Ethiopian cuisine with our curated selection of traditional dishes.
      </p>
      <Link href="/menu">
        View Menu
      </Link>
     <Link href="/cart">
      cart
     </Link>
    </main>
    )
}