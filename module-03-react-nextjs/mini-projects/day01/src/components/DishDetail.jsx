import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useCartStore } from '../cartStore';

function DishDetail() {
  const { id } = useParams();
  const { data: dishes, loading, error } = useFetch('/dishes.json');
  const addItem = useCartStore((state) => state.addItem);

  if (loading) {
    return (
      <div className="status-container loading-state">
        <div className="spinner" />
        <p>Loading dish details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-container error-state">
        <p>⚠️ Error loading dish: {error}</p>
        <Link to="/menu" className="secondary-btn">
          ← Back to Menu
        </Link>
      </div>
    );
  }

  const dish = Array.isArray(dishes)
    ? dishes.find((item) => String(item.id) === String(id))
    : null;

  if (!dish) {
    return (
      <div className="status-container empty-state">
        <h2>Dish Not Found</h2>
        <p>The dish with ID &quot;{id}&quot; does not exist in our menu.</p>
        <Link to="/menu" className="secondary-btn">
          ← Back to Menu
        </Link>
      </div>
    );
  }

  function handleAddToCart() {
    addItem(dish);
  }

  return (
    <div className="dish-detail-container">
      <div className="dish-detail-card">
        <div className="dish-detail-header">
          <h2>{dish.name}</h2>
          {dish.isSpicy && <span className="spicy-badge">🌶️ Spicy</span>}
        </div>

        <p className="category">
          Category: <strong>{dish.catagory || dish.category}</strong>
        </p>

        <p className="price-tag">{dish.price} ETB</p>

        <p className="dish-detail-desc">
          Fresh, flavorful, and authentic Ethiopian {dish.name}. Prepared with traditional recipes and premium local spices.
        </p>

        <div className="dish-detail-actions">
          <button
            type="button"
            className="submit-order-btn"
            onClick={handleAddToCart}
          >
            + Add to Cart ({dish.price} ETB)
          </button>
          <Link to="/menu" className="secondary-btn">
            ← Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DishDetail;
