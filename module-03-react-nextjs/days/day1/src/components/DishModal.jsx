import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function DishModal({ dish, isOpen, onClose, onAddToCart, triggerRef }) {
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousFocusedElement = triggerRef?.current || document.activeElement;

    if (closeBtnRef.current) {
      closeBtnRef.current.focus();
    } else if (modalRef.current) {
      modalRef.current.focus();
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (previousFocusedElement && typeof previousFocusedElement.focus === "function") {
        previousFocusedElement.focus();
      }
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen || !dish) {
    return null;
  }

  const modalContent = (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        className="modal-card"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-dish-title"
        tabIndex={-1}
      >
        <div className="modal-header">
          <h2 id="modal-dish-title">{dish.name}</h2>
          <button
            ref={closeBtnRef}
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-badge-group">
            <span className="modal-category-badge">{dish.catagory}</span>
            {dish.isSpicy && <span className="modal-spicy-badge">🌶️ Spicy</span>}
          </div>

          <p className="modal-price">
            {dish.price} {dish.currency || "ETB"}
          </p>

          <p className="modal-description">
            Authentic traditional Ethiopian specialty prepared fresh with premium herbs, spices, and authentic touch.
          </p>

          <div className="modal-nutrition-tags">
            <span>Fresh Ingredients</span>
            <span>Traditional Recipe</span>
            <span>High Protein</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-cancel-btn" onClick={onClose}>
            Close
          </button>
          <button
            className="modal-add-btn"
            onClick={() => {
              onAddToCart(dish);
              onClose();
            }}
          >
            Add to Order
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default DishModal;
