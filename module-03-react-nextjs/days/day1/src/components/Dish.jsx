import React, { useState } from 'react'
import Card from './Card'
import propTypes from 'prop-types'

function Dish({ id, name, price, catagory, currency = "ETB", isSpicy, onAdd, onItem }) {
  const [count, setCount] = useState(0);

  return (
    <div className="cards">
      <Card>
        <h3>{name}</h3>
        <p className="price">{price} {currency}</p>
        <p className="category">{catagory}</p>
        <button onClick={() => { onAdd(price); if (onItem) onItem(); }}>Add</button>
        <p> {isSpicy && 'Spicy'}</p>
      </Card>
    </div>
  )
}

Dish.propTypes = {
  name: propTypes.string.isRequired,
  price: propTypes.number.isRequired,
  catagory: propTypes.string.isRequired,
  currency: propTypes.string,
  isSpicy: propTypes.bool,
}

export default Dish