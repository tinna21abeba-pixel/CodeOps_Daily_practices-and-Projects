import React from "react";
import Card from "./Card";
import propTypes from "prop-types";
import { useCartStore } from "../store/useCartStore";

function Dish({ id, name, price, catagory, currency = "ETB", isSpicy }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="cards">
      <Card>
        <h3>{name}</h3>
        <p className="price">
          {price} {currency}
        </p>
        <p className="category">{catagory}</p>
        <button
          onClick={() => addItem({ id, name, price, catagory, isSpicy })}
        >
          Add
        </button>
        <p>{isSpicy && "Spicy"}</p>
      </Card>
    </div>
  );
}

Dish.propTypes = {
  id: propTypes.oneOfType([propTypes.string, propTypes.number]),
  name: propTypes.string.isRequired,
  price: propTypes.number.isRequired,
  catagory: propTypes.string.isRequired,
  currency: propTypes.string,
  isSpicy: propTypes.bool,
};

export default Dish;