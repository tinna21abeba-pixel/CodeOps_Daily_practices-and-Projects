import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * MenuUnavailable Fallback
 * Informs the user when the Menu region crashes, with actionable recovery buttons.
 */
export function MenuUnavailable({ error, resetErrorBoundary }) {
  return (
    <div className="error-fallback-card menu-fallback" role="alert" aria-live="assertive">
      <div className="fallback-header">
        <span className="fallback-icon" aria-hidden="true">🍲⚠️</span>
        <div>
          <h3>Menu is Currently Unavailable</h3>
          <p className="fallback-subtitle">
            A rendering issue occurred while displaying the Ethiopian dishes.
          </p>
        </div>
      </div>

      <div className="fallback-details">
        <p className="fallback-error-text">
          <strong>Error details:</strong> {error?.message || 'Component failed to render'}
        </p>
        <p className="fallback-reassurance">
          💡 Good news: The rest of the app is unaffected. Your <strong>Shopping Cart</strong> and <strong>Account</strong> are still running!
        </p>
      </div>

      <div className="fallback-actions">
        {resetErrorBoundary && (
          <button
            type="button"
            className="action-btn-primary"
            onClick={resetErrorBoundary}
          >
            🔄 Reload Menu
          </button>
        )}
        <Link to="/cart" className="secondary-btn action-link">
          🛒 View Cart
        </Link>
        <Link to="/" className="secondary-btn action-link">
          🏠 Return Home
        </Link>
      </div>
    </div>
  );
}

MenuUnavailable.propTypes = {
  error: PropTypes.object,
  resetErrorBoundary: PropTypes.func,
};

/**
 * CartUnavailable Fallback
 * Informs the user when the Cart region crashes, preserving the Menu.
 */
export function CartUnavailable({ error, resetErrorBoundary }) {
  return (
    <div className="error-fallback-card cart-fallback" role="alert" aria-live="assertive">
      <div className="fallback-header">
        <span className="fallback-icon" aria-hidden="true">🛒⚠️</span>
        <div>
          <h3>Cart Service Unavailable</h3>
          <p className="fallback-subtitle">
            An error occurred in the cart calculation or display engine.
          </p>
        </div>
      </div>

      <div className="fallback-details">
        <p className="fallback-error-text">
          <strong>Error details:</strong> {error?.message || 'Cart component failed'}
        </p>
        <p className="fallback-reassurance">
          💡 Your menu and dishes remain completely functional and accessible.
        </p>
      </div>

      <div className="fallback-actions">
        {resetErrorBoundary && (
          <button
            type="button"
            className="action-btn-primary"
            onClick={resetErrorBoundary}
          >
            🔄 Reset Cart
          </button>
        )}
        <Link to="/menu" className="secondary-btn action-link">
          🍲 Back to Menu
        </Link>
      </div>
    </div>
  );
}

CartUnavailable.propTypes = {
  error: PropTypes.object,
  resetErrorBoundary: PropTypes.func,
};

/**
 * DishUnavailable Fallback
 * Used around individual dish cards so one bad dish does not break the entire menu grid.
 */
export function DishUnavailable({ error, resetErrorBoundary }) {
  return (
    <div className="cards dish-error-card" role="alert">
      <div className="dish-fallback-inner">
        <span className="dish-error-icon" aria-hidden="true">⚠️</span>
        <h4>Dish Details Unavailable</h4>
        <p className="dish-error-msg">{error?.message || 'Failed to render dish'}</p>
        {resetErrorBoundary && (
          <button
            type="button"
            className="retry-dish-btn"
            onClick={resetErrorBoundary}
          >
            🔄 Retry Dish
          </button>
        )}
      </div>
    </div>
  );
}

DishUnavailable.propTypes = {
  error: PropTypes.object,
  resetErrorBoundary: PropTypes.func,
};

/**
 * CheckoutUnavailable Fallback
 * Used around lazy-loaded checkout route.
 */
export function CheckoutUnavailable({ error, resetErrorBoundary }) {
  return (
    <div className="error-fallback-card checkout-fallback" role="alert" aria-live="assertive">
      <div className="fallback-header">
        <span className="fallback-icon" aria-hidden="true">💳⚠️</span>
        <div>
          <h3>Checkout Unavailable</h3>
          <p className="fallback-subtitle">
            Unable to load the checkout module or chunk download failed.
          </p>
        </div>
      </div>

      <div className="fallback-details">
        <p className="fallback-error-text">
          <strong>Error details:</strong> {error?.message || 'Failed to load checkout bundle'}
        </p>
      </div>

      <div className="fallback-actions">
        {resetErrorBoundary && (
          <button
            type="button"
            className="action-btn-primary"
            onClick={resetErrorBoundary}
          >
            🔄 Try Loading Again
          </button>
        )}
        <Link to="/cart" className="secondary-btn action-link">
          🛒 Back to Cart
        </Link>
        <Link to="/menu" className="secondary-btn action-link">
          🍲 Back to Menu
        </Link>
      </div>
    </div>
  );
}

CheckoutUnavailable.propTypes = {
  error: PropTypes.object,
  resetErrorBoundary: PropTypes.func,
};

/**
 * ReceiptUnavailable Fallback
 */
export function ReceiptUnavailable({ error, resetErrorBoundary }) {
  return (
    <div className="error-fallback-card receipt-fallback" role="alert" aria-live="assertive">
      <div className="fallback-header">
        <span className="fallback-icon" aria-hidden="true">🧾⚠️</span>
        <div>
          <h3>Receipt Unavailable</h3>
          <p className="fallback-subtitle">
            Could not render the receipt confirmation.
          </p>
        </div>
      </div>

      <div className="fallback-details">
        <p className="fallback-error-text">
          <strong>Error:</strong> {error?.message || 'Receipt error'}
        </p>
      </div>

      <div className="fallback-actions">
        {resetErrorBoundary && (
          <button
            type="button"
            className="action-btn-primary"
            onClick={resetErrorBoundary}
          >
            🔄 Try Again
          </button>
        )}
        <Link to="/menu" className="secondary-btn action-link">
          🍲 Back to Menu
        </Link>
      </div>
    </div>
  );
}

ReceiptUnavailable.propTypes = {
  error: PropTypes.object,
  resetErrorBoundary: PropTypes.func,
};
