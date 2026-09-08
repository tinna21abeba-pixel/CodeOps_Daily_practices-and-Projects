import React from 'react'
import {useParams} from 'react-router-dom'

function Dish() {
    const {id}=useParams();
    

    
  return (
    <div>
        <h2>Dish details</h2>
        <p>dish id: {id}</p>
    </div>
  )
}

export default Dish