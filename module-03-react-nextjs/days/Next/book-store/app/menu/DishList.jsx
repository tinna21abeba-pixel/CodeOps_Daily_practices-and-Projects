import Link from "next/link";
import dishes from "../data/Dishes";

export default function DishList({ selectedCategory }) {
  const filteredDishes =
    selectedCategory === "all"
      ? dishes
      : dishes.filter(
          (dish) => dish.category === selectedCategory
        );
  function handleAddToCart(dish){
    const cart = []
    if(cart.length > 0){
      const cartItem = cart.find((item)=>item.id === dish.id)
      if(cartItem){
        cartItem.quantity += 1
      }else{
        cart.push(dish)
      }
    }else{
      cart.push(dish)
    }
 
    
  }
  return (
    <section>
     
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 m-4 p-4 gap-6">

      {filteredDishes.map((dish) => (
        <article key={dish.id} className="border gap-2 bg-white text-black rounded-lg text-center">
          <div className="m-l-5">
          <h3 className="mb-2">{dish.name}</h3>
          <p>Category: {dish.category}</p>

          <p>{dish.description}</p>

          <p>{dish.price} ETB</p>

          <Link href={`/menu/${dish.id}`} className="bg-orange-500 text-white p-2 rounded-lg cursor-pointer m-2">
            View Details
          </Link>
          </div>
        </article>
      ))}
      </div>
    </section>
  );
}