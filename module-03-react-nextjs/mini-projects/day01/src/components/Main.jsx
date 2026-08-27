import React from 'react'
import Dish from './Dish'

const menu = [
  {id:1, name: "Doro Wet", price: 250, catagory: "main", isSpicy: true },
  {id:2, name: "Kitfo", price: 350, catagory: "main", isSpicy: true },
  {id:3, name: "Shiro", price: 150, catagory: "side", isSpicy: false },
  {id:4, name: "Injera", price: 50, catagory: "side", isSpicy: false },
  {id:5, name: "Ayib", price: 100, catagory: "side", isSpicy: false },
  {id:6, name: "Gomen", price: 100, catagory: "side", isSpicy: false },
  { name: "Tibs", price: 300, catagory: "main", isSpicy: true },
  { name: "Beyainetu", price: 250, catagory: "main", isSpicy: false }
]
let mains=menu.filter((dish)=>dish.catagory=="main")
let sides=menu.filter((dish)=>dish.catagory=="side")

function Main() {
  return (
    <main className="menu-container">
        <div className="main">
        <h1>main dishes</h1>
      {mains.map((dish, index) => (
        <Dish
          key={index}
          name={dish.name}
          price={dish.price}
          catagory={dish.catagory}
          isSpicy={dish.isSpicy}
        />
      ))}
      </div>
      <div className="side">
        <h1>side dishes</h1>
        {sides.map((item)=>(
            <Dish
            key={item.id}
            name={item.name}
            price={item.price}
            catagory={item.catagory}
            isSpicy={item.isSpicy}
            />
            
        ))}
        
      </div>
    </main>
  )
}

export default Main