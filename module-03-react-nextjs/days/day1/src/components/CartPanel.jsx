import React, { useState } from "react";
import { useCartStore } from "../store/useCartStore";

function CartPanel({ onGoToCheckout }) {
  const [shouldCrash, setShouldCrash] = useState(false);

  const items = useCartStore((state) => state.items);
  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const remove = useCartStore((state) => state.remove);
  const clear = useCartStore((state) => state.clear);

  if (shouldCrash) {
    throw new Error("Deliberate crash inside CartPanel component.");
  }

  const totalQuantity = items.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  return (
    <section className="cart-panel" aria-label="Shopping Cart">
      <div className="cart-panel-header">
        <div className="cart-title-wrap">
          <span className="cart-icon">🛒</span>
          <h3>Your Order Cart</h3>
        </div>
        <div className="cart-header-actions">
          <button
            className="cart-crash-btn"
            onClick={() => setShouldCrash(true)}
            title="Test Cart Error Boundary"
          >
            💥 Crash Cart
          </button>
          {items.length > 0 && (
            <button className="cart-clear-btn" onClick={clear}>
              Clear All
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="cart-empty-box">
          <p>No dishes in cart yet.</p>
          <span className="cart-empty-sub">
            Add delicious dishes from the menu to start!
          </span>
        </div>
      ) : (
        <div className="cart-items-container">
          {items.map((item) => (
            <div key={item.id} className="cart-item-card">
              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p className="cart-item-unit-price">{item.price} ETB each</p>
              </div>

              <div className="cart-item-controls">
                <button
                  className="qty-btn"
                  onClick={() => decrementQuantity(item.id)}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="item-qty-badge">{item.quantity || 1}</span>
                <button
                  className="qty-btn"
                  onClick={() => incrementQuantity(item.id)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
                <span className="cart-item-subtotal">
                  {item.price * (item.quantity || 1)} ETB
                </span>
                <button
                  className="item-remove-btn"
                  onClick={() => remove(item.id)}
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          <div className="cart-footer-summary">
            <div className="cart-summary-line">
              <span>Total Items:</span>
              <strong>{totalQuantity}</strong>
            </div>
            <div className="cart-summary-line total-line">
              <span>Total Amount:</span>
              <strong>{totalPrice} ETB</strong>
            </div>
            <button
              className="proceed-checkout-btn"
              onClick={onGoToCheckout}
              disabled={items.length === 0}
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default CartPanel;
