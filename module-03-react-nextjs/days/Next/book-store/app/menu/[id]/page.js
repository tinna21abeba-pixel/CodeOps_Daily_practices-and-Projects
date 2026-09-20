
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
      <div className="border m-4 p-4 gap-2 w-1/3">

    <h2>{dish.name}</h2>
    <p>{dish.price}</p>
    <p>{dish.category}</p>
    <p>{dish.description}</p>
      </div>
    <Link href="/menu" className="bg-orange-500 rounded-lg text-white  p-2 text-center  m-2">Back to Menu</Link>
      
    </main>
  );
}