import React from 'react';
import { useCartStore } from '../cartStore';

function CartBadge() {
  const itemCount = useCartStore((state) => state.items.length);
  const total = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.price, 0)
  );

  return (
    <div className="cart-badge-container">
      <div className="cart-badge-icon" aria-label="Cart items count">
        <span className="cart-icon">🛒</span>
        {itemCount > 0 && (
          <span className="badge-count" data-testid="cart-badge-count">
            {itemCount}
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
