import React from 'react';
import CheckoutPanel from './CheckoutPanel';

/**
 * Checkout Component
 * Protected checkout screen accessed after passing RequireAuth guard.
 */
function Checkout() {
  return (
    <div className="checkout-page-wrapper">
      <CheckoutPanel />
    </div>
  );
}

export default Checkout;
