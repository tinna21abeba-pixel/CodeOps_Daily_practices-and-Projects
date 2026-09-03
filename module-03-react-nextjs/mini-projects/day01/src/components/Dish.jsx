import React from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
import { useCart } from '../context/CartProvider';

function Dish({ dish }) {
  const { dispatch } = useCart();

  function handleAddToCart() {
    dispatch({ type: 'add', dish });
  }

  return (
    <div className="cards">
      <Card>
        <div className="dish-card-header">
          <h3>{dish.name}</h3>
          {dish.isSpicy && <span className="spicy-badge">🌶️ Spicy</span>}
        </div>
        <p className="category">{dish.catagory}</p>
        <div className="dish-card-footer">
          <p className="price">{dish.price} ETB</p>
          <button
            type="button"
            className="add-btn"
            onClick={handleAddToCart}
            aria-label={`Add ${dish.name} to cart`}
          >
            + Add to Cart
          </button>
        </div>
      </Card>
    </div>
  );
}

Dish.propTypes = {
  dish: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    catagory: PropTypes.string.isRequired,
    isSpicy: PropTypes.bool,
  }).isRequired,
};

export default Dish;