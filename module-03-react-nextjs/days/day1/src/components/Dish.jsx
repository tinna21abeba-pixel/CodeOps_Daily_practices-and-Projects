import React, { useRef } from "react";
import Card from "./Card";
import propTypes from "prop-types";

const Dish = React.memo(function Dish({
  dish,
  onAddToCart,
  onOpenDetails,
  shouldCrash = false,
  onTriggerCrash,
}) {
  const detailsBtnRef = useRef(null);

  if (shouldCrash) {
    throw new Error(`Deliberate crash triggered inside dish component: "${dish.name}"`);
  }

  return (
    <div className="cards">
      <Card>
        <div className="dish-card-header">
          <h3>{dish.name}</h3>
          {dish.isSpicy && <span className="spicy-pill">🌶️ Spicy</span>}
        </div>

        <p className="price">
          {dish.price} {dish.currency || "ETB"}
        </p>
        <p className="category">{dish.catagory}</p>

        <div className="dish-card-actions">
          <button
            ref={detailsBtnRef}
            className="details-btn"
            onClick={() => onOpenDetails(dish, detailsBtnRef)}
            aria-haspopup="dialog"
          >
            Details
          </button>
          <button
            className="add-btn"
            onClick={() => onAddToCart(dish)}
          >
            Add to Cart
          </button>
          <button
            className="crash-dish-btn"
            onClick={() => onTriggerCrash(dish.id)}
            title="Deliberately throw error inside this dish"
          >
            💥 Crash
          </button>
        </div>
      </Card>
    </div>
  );
});

Dish.propTypes = {
  dish: propTypes.shape({
    id: propTypes.oneOfType([propTypes.string, propTypes.number]).isRequired,
    name: propTypes.string.isRequired,
    price: propTypes.number.isRequired,
    catagory: propTypes.string.isRequired,
    currency: propTypes.string,
    isSpicy: propTypes.bool,
  }).isRequired,
  onAddToCart: propTypes.func.isRequired,
  onOpenDetails: propTypes.func.isRequired,
  shouldCrash: propTypes.bool,
  onTriggerCrash: propTypes.func.isRequired,
};

export default Dish;