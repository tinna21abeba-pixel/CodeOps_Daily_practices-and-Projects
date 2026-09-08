import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'


function Menu() {
    const dishes=[
        {
            id:1,
            name:"Doro Wot",
            price:"1200",
            category:"traditional"
        },
        {
            id:2,
            name:"Shiro",
            price:"1300",
            category:"traditional"
        },
        {
            id:3,
            name:"Kitfo",
            price:"1400",
            category:"traditional"
        },
        {
            id:4,
            name:"Tibs",
            price:"1500",
            category:"traditional"
        },
        {id:5, name:"pizza",price:"2000",category:"fast food"},
        {id:6, name:"pasta",price:"2000",category:"fast food"},
        {id:7, name:"sushi",price:"2000",category:"fast food"},
        {id:8, name:"burger",price:"2000",category:"fast food"},
        {id:9, name:"fries",price:"2000",category:"fast food"},
        {id:10, name:"salad",price:"2000",category:"fast food"},
    ]
     const [searchParams,setSearchParams]=useSearchParams()
    const category=searchParams.get('category');
    const filterdDish=category?dishes.filter((dish)=>dish.category===category):dishes

  return (
    <div>
        <h1>Our menu</h1>
         <button onClick={()=>setSearchParams({category: 'all'})}>All</button>
         <button onClick={()=>setSearchParams({category:'traditional'})}>Traditoional</button>
         <button onClick={()=>setSearchParams({category:'fast food'})}>Fast Food</button>
         {
            filterdDish.map((dish)=>(
                <div key={dish.id}>
                    <h2>{dish.name}</h2>
                    <p>{dish.price}</p>
                    <Link to={`/menu/${dish.id}`}>view detail</Link>
                    </div>
            
            ))
         }
    </div>
  )
}

export default Menu