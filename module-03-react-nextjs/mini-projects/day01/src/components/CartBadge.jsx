import React from 'react';
import { useCart } from '../context/CartProvider';

/**
 * CartBadge Component
 * Reads items and total directly from CartContext via useCart()
 * Demonstrates zero prop drilling across the component tree.
 */
function CartBadge() {
  const { items, total } = useCart();

  return (
    <div className="cart-badge-container">
      <div className="cart-badge-icon" aria-label="Cart items count">
        <span className="cart-icon">🛒</span>
        {items.length > 0 && (
          <span className="badge-count" data-testid="cart-badge-count">
            {items.length}
          </span>
        )}
      </div>
      <div className="badge-details">
        <span className="badge-label">Cart Total</span>
        <span className="badge-amount">{total} ETB</span>
      </div>
    </div>
  );
}

export default CartBadge;
