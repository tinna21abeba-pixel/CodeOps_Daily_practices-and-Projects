import Link from "next/link";
export default function Home(){
    return (
         <main  className="bg-cover bg-center bg-no-repeat h-screen"
  style={{ backgroundImage: "url('https://typicalethiopian.com/wp-content/uploads/2022/02/8.-raw-meat.jpg')" }}>
      <h1>Welcome to Addis Eats</h1>
      <p>
        Experience the authentic taste of Ethiopian cuisine with our curated selection of traditional dishes.
      </p>
      <Link href="/menu">
        View Menu
      </Link>
    </main>
    )
}