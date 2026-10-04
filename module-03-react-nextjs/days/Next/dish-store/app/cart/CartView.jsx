"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function cartView(){
     const {items, remove, clear} = useCart();
      const total=items.reduce((sum, item)=> sum + item.price * item.quantity,0).toFixed(2);

      if(items.length === 0){
         return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-stone-600">Your cart is empty</h2>
                <Link href="/store">
                <button className="text-stone-400 mt-4">Back to store</button>
                </Link>
            </div>
         )
      }

      return (
        <div>
            <h2>Your cart:</h2>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        <p>{item.name}</p>
                        <p>{item.price}</p>
                        <p>{item.quantity}</p>
                        <button onClick={() => remove(item.id)}>Remove</button>
                    </li>
                ))}
            </ul>
            <p>Total: {total}</p>
            <button onClick={clear}>Clear cart</button>
        </div>
      )
}