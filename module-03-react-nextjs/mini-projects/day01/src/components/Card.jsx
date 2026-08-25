import React from 'react'


const menu=[
    {name:"dorowet", price:1500, image:""},
   {name:"shiro", price:300, image:""},
   {name:"kitfo", price:800, image:""},
   {name:"tibs", price:600, image:""}
]

function Card() {
  return (
    <div className='cards'>
    {menu.map((item)=>(
        <div className="card" key={item.name}>
            <h2 className='name'>{item.name}</h2>
           <p className="price">{item.price}</p>
        </div>

    ))}
    </div>
  )
}

export default Card

