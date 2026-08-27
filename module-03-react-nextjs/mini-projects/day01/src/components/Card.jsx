import React from 'react'
const menu=[
    {name:"dorowet", price:1500},
   {name:"shiro", price:300},
   {name:"kitfo", price:800},
   {name:"tibs", price:600}
]

function Card() {
  return (
    <>
    <div className="cards">
    {menu.map((item, index)=>(
      <div className="csrd" key={index}>
        <h1 className="name">{item.name}</h1>
     
        <p className="price">{item.price}</p>
        
      </div>
    ))}
    </div>
    </>
  )
}

export default Card