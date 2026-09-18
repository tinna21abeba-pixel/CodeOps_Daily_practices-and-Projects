"use client"

import dishes from "../data/dishes"
import Link from "next/link"


export default   function DishList({ selectedCategory }) {
    
    const filteredDish = selectedCategory === "All" ? dishes : dishes.filter((dish) => dish.category === selectedCategory)
     function handleAddToCart(dish) {
         const cart = []
         if(cart.length > 0){
             const cartItem = cart.find((item)=>item.id === dish.id)
             if(cartItem){
                 cartItem.quantity += 1
             }else{
                 cart.push({dish})
             }
         }else{
             cart.push(dish)
         }
        
     }

   return (
  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
    {filteredDish.map((dish) => (
      <div
        key={dish.id}
        className="bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-amber-500/20 hover:-translate-y-2 transition duration-300"
      >
       

        <div className="p-6">
          <h3 className="text-2xl font-bold text-white">
            {dish.name}
          </h3>

          <p className="text-zinc-400 mt-2 line-clamp-3">
            {dish.description}
          </p>

          <div className="mt-4 flex justify-between items-center">
            <span className="text-amber-500 text-xl font-bold">
              {dish.price} ETB
            </span>
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              href={`/menu/${dish.id}`}
              className="flex-1 text-center bg-white text-zinc-900 py-2 rounded-lg font-semibold hover:bg-zinc-200 transition"
            >
              View Details
            </Link>

            <button
              onClick={() => handleAddToCart(dish)}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg font-semibold transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);
}