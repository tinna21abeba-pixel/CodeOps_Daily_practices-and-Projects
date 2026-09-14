import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../ui/Modal';

/**
 * DishModal Component
 * Accessible modal displaying Ethiopian dish details with focus trapping and focus return.
 */
export function DishModal({ dish, isOpen, onClose, onAddToCart, triggerRef }) {
  if (!dish) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={dish.name}
      titleId={`modal-dish-${dish.id}-title`}
      triggerRef={triggerRef}
      className="dish-modal-dialog"
    >
      <div className="dish-modal-body">
        <div className="dish-modal-badges">
          <span className="dish-category-badge">{dish.catagory || dish.category}</span>
          {dish.isSpicy && <span className="dish-spicy-badge">🌶️ Spicy</span>}
        </div>

        <p className="dish-modal-price">{dish.price} ETB</p>

        <p className="dish-modal-description">
          Authentic traditional Ethiopian {dish.name} prepared fresh with traditional herbs, berbere, and organic ingredients. Served hot with fresh Injera or accompaniment.
        </p>

        <div className="dish-modal-tags">
          <span className="tag-pill">🌱 Traditional Recipe</span>
          <span className="tag-pill">✨ Fresh Ingredients</span>
          <span className="tag-pill">🇪🇹 Authentic Taste</span>
        </div>
      </div>

      <div className="dish-modal-footer">
        <button
          type="button"
          className="secondary-btn modal-cancel-btn"
          onClick={onClose}
        >
          Close (<kbd>Esc</kbd>)
        </button>
        <button
          type="button"
          className="action-btn-primary modal-add-btn"
          onClick={() => {
            onAddToCart(dish);
            onClose();
          }}
        >
          + Add to Order ({dish.price} ETB)
        </button>
      </div>
    </Modal>
  );
}

DishModal.propTypes = {
  dish: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    catagory: PropTypes.string,
    category: PropTypes.string,
    isSpicy: PropTypes.bool,
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  triggerRef: PropTypes.shape({ current: PropTypes.any }),
};

export default DishModal;
