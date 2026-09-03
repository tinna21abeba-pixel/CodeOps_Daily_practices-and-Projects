import React, { useState } from 'react';
import { useCart } from '../context/CartProvider';

function CheckoutPanel() {
  const { items, dispatch, total } = useCart();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    area: 'Bole',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Validate Ethiopian phone numbers (+2519... or 09...)
  const isPhoneValid = /^(\+251|0)9\d{8}$/.test(form.phone.trim());
  const isNameValid = form.name.trim().length >= 2;
  const canSubmit = items.length > 0 && isPhoneValid && isNameValid;

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    setOrderPlaced(true);
    dispatch({ type: 'clear' });
  }

  function handleResetOrder() {
    setOrderPlaced(false);
    setForm({ name: '', phone: '', area: 'Bole' });
  }

  return (
    <div className="checkout-panel">
      <h2>🛒 Order & Checkout</h2>

      {orderPlaced ? (
        <div className="order-success-card">
          <div className="success-icon">🎉</div>
          <h3>Order Confirmed!</h3>
          <p>Thank you, <strong>{form.name}</strong>!</p>
          <p className="order-details">
            Delivering to <strong>{form.area}</strong>. We will call you at <strong>{form.phone}</strong>.
          </p>
          <button
            type="button"
            className="secondary-btn"
            onClick={handleResetOrder}
          >
            Place Another Order
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items-section">
            <div className="cart-header-bar">
              <span className="cart-count-text">
                Items in Cart: <strong>{items.length}</strong>
              </span>
              {items.length > 0 && (
                <button
                  type="button"
                  className="clear-cart-btn"
                  onClick={() => dispatch({ type: 'clear' })}
                  title="Remove all items from cart"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {items.length === 0 ? (
              <p className="empty-cart-message">
                Your cart is currently empty. Add some delicious Ethiopian dishes from the menu!
              </p>
            ) : (
              <ul className="cart-items-list">
                {items.map((item, index) => (
                  <li key={`${item.id}-${index}`} className="cart-item-row">
                    <div className="cart-item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-price">{item.price} ETB</span>
                    </div>
                    <button
                      type="button"
                      className="remove-item-btn"
                      onClick={() => dispatch({ type: 'remove', id: item.id })}
                      title={`Remove ${item.name}`}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="cart-summary-total">
              <span>Derived Total:</span>
              <span className="total-amount">{total} ETB</span>
            </div>
          </div>

          <form className="order-form" onSubmit={handleSubmit}>
            <h3>Customer & Delivery Info</h3>

            <div className="form-group">
              <label htmlFor="customer-name">Full Name</label>
              <input
                id="customer-name"
                type="text"
                name="name"
                placeholder="e.g. Abebe Bikila"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="customer-phone">
                Phone Number <span className="helper-text">(09... or +2519...)</span>
              </label>
              <input
                id="customer-phone"
                type="tel"
                name="phone"
                placeholder="0911234567"
                value={form.phone}
                onChange={handleChange}
                required
              />
              {form.phone && !isPhoneValid && (
                <span className="field-error">Please enter a valid Ethiopian phone number.</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="customer-area">Delivery Area</label>
              <select
                id="customer-area"
                name="area"
                value={form.area}
                onChange={handleChange}
              >
                <option value="Bole">Bole</option>
                <option value="Summit">Summit</option>
                <option value="Kazanchis">Kazanchis</option>
                <option value="Piassa">Piassa</option>
                <option value="Sarbet">Sarbet</option>
                <option value="CMC">CMC</option>
                <option value="Megenagna">Megenagna</option>
              </select>
            </div>

            <button
              type="submit"
              className="submit-order-btn"
              disabled={!canSubmit}
            >
              {items.length === 0
                ? 'Add Items to Order'
                : `Complete Order (${total} ETB)`}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default CheckoutPanel;
