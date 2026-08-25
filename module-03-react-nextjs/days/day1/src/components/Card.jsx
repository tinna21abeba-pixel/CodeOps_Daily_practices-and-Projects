import React from 'react'


const menu=[
  {name:"dorowot",price:270},
  {name:"shiro",price:200},
  {name:"kitfo",price:300},
  {name:"tibs",price:250},
]

function Card() {
  return (
    <div className="cards">
    {menu.map((item)=>(
        <div className="card">
        <h2 className="name">{item.name}</h2>
        <p className='price'>{item.price}</p>
        </div>
    ))}
    </div>
  )
}

export default Card
