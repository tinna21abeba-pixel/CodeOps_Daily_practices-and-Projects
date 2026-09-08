import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartProvider';

/**
 * Cart Component
 * Displays items added to the cart, calculates total, and links to checkout.
 */
function Cart() {
  const { items, dispatch, total } = useCart();

  return (
    <div className="cart-page">
      <h2>🛒 Your Shopping Cart</h2>

      {items.length === 0 ? (
        <div className="status-container empty-state">
          <p>Your cart is currently empty.</p>
          <Link to="/menu" className="secondary-btn">
            Browse Menu to Add Dishes
          </Link>
        </div>
      ) : (
        <div className="cart-page-content">
          <div className="cart-header-bar">
            <span className="cart-count-text">
              Items in Cart: <strong>{items.length}</strong>
            </span>
            <button
              type="button"
              className="clear-cart-btn"
              onClick={() => dispatch({ type: 'clear' })}
            >
              Clear All Items
            </button>
          </div>

          <ul className="cart-items-list">
            {items.map((item, index) => (
              <li key={`${item.id}-${index}`} className="cart-item-row">
                <div className="cart-item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">{item.price} ETB</span>
                </div>
                <div className="cart-row-actions">
                  <Link to={`/menu/${item.id}`} className="view-detail-link">
                    Details
                  </Link>
                  <button
                    type="button"
                    className="remove-item-btn"
                    onClick={() => dispatch({ type: 'remove', id: item.id })}
                    title={`Remove ${item.name}`}
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-summary-total">
            <span>Derived Total:</span>
            <span className="total-amount">{total} ETB</span>
          </div>

          <div className="cart-actions-bar">
            <Link to="/menu" className="secondary-btn action-link">
              ← Continue Ordering
            </Link>
            <Link to="/checkout" className="submit-order-btn action-link">
              Proceed to Checkout →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
