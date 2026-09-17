
import dishes from "@/app/data/Dishes";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function DishDetails({ params }) {
  const { id } = await params;
   const dish=dishes.find((dish)=>dish.id==id)
   if(!dish){
    notFound();
   }

  return (
    <main>
      <h1>Dish Details</h1>
    <h2>{dish.name}</h2>
    <p>{dish.price}</p>
    <p>{dish.category}</p>
    <p>{dish.description}</p>
    <Link href="/menu">Back to Menu</Link>
      
    </main>
  );
}