import React, { useState, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from './Card';
import { useCartStore } from '../cartStore';
import DishModal from './DishModal';
import ErrorBoundary from './ErrorBoundary';
import { DishUnavailable } from './Fallbacks';

/**
 * Inner Dish Content Component
 * Demonstrates deliberate error throwing and modal interaction.
 */
function DishContent({ dish, onAddToCart }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldCrash, setShouldCrash] = useState(false);
  const quickViewBtnRef = useRef(null);

  // Deliberate error demonstration for region isolation check
  if (shouldCrash) {
    throw new Error(`Deliberate crash triggered on dish "${dish.name}" (ID: ${dish.id}).`);
  }

  return (
    <div className="cards">
      <Card>
        <div className="dish-card-header">
          <h3>{dish.name}</h3>
          {dish.isSpicy && <span className="spicy-badge">🌶️ Spicy</span>}
        </div>

        <p className="category">{dish.catagory || dish.category}</p>

        <div className="dish-card-footer">
          <p className="price">{dish.price} ETB</p>
          <div className="dish-card-actions">
            {/* Quick View Button: opens portal modal with focus return */}
            <button
              ref={quickViewBtnRef}
              type="button"
              className="quick-view-btn"
              onClick={() => setIsModalOpen(true)}
              aria-haspopup="dialog"
              aria-label={`Quick view details for ${dish.name}`}
            >
              👁️ View
            </button>

            <Link to={`/menu/${dish.id}`} className="view-detail-link">
              Details
            </Link>

            <button
              type="button"
              className="add-btn"
              onClick={() => onAddToCart(dish)}
              aria-label={`Add ${dish.name} to cart`}
            >
              + Add
            </button>
          </div>
        </div>

        {/* Deliberate Crash Simulation Button */}
        <div className="dish-debug-actions">
          <button
            type="button"
            className="crash-dish-btn"
            onClick={() => setShouldCrash(true)}
            title={`Simulate crash for ${dish.name}`}
          >
            💥 Crash Dish
          </button>
        </div>
      </Card>

      {/* Dish Modal rendered via createPortal */}
      <DishModal
        dish={dish}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={onAddToCart}
        triggerRef={quickViewBtnRef}
      />
    </div>
  );
}

DishContent.propTypes = {
  dish: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    catagory: PropTypes.string,
    category: PropTypes.string,
    isSpicy: PropTypes.bool,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

/**
 * Dish Component wrapped in an isolated ErrorBoundary and memoized with React.memo
 * to eliminate wasteful re-renders during search input changes in Menu.
 */
function Dish({ dish, onAddToCart }) {
  const addItem = useCartStore((state) => state.addItem);
  const handleAdd = onAddToCart || addItem;

  return (
    <ErrorBoundary
      fallback={<DishUnavailable />}
      resetKey={dish?.id}
      regionName={`Dish ${dish?.name || ''}`}
    >
      <DishContent dish={dish} onAddToCart={handleAdd} />
    </ErrorBoundary>
  );
}

Dish.propTypes = {
  dish: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    catagory: PropTypes.string,
    category: PropTypes.string,
    isSpicy: PropTypes.bool,
  }).isRequired,
  onAddToCart: PropTypes.func,
};

// React.memo optimization: justified by measurements in PROFILE.md
export default memo(Dish);