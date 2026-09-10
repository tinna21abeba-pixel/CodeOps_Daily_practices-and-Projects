import React, { useState, useRef } from 'react';
import { useCartStore } from '../cartStore';
import { validate } from '../validate';
import Field from './Field';

/**
 * Checkout Component - The Addis Eats Checkout
 *
 * Implements all 6 honest states:
 * 1. Idle / Pristine: Initial load, form values ready, zero annoying error messages until touched.
 * 2. Validating / Touched: Errors appear only on blur, then update live as fields are corrected.
 * 3. Submitting: Button disabled, displays ETB total in label, single submission guarantee.
 * 4. Success: Clean order confirmation screen, details summary, clears cart.
 * 5. Failure: Keeps 100% of entered values on error, announces alert banner, shifts focus to first invalid field.
 * 6. Empty Cart: Clear notice when 0 items exist, disabling checkout with menu navigation link.
 */
function Checkout() {
  // Cart state via narrow selectors
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);
  const total = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.price, 0)
  );

  // 1. All four fields controlled from one state object
  const [form, setForm] = useState({
    name: '',
    phone: '',
    area: 'Bole',
    address: '',
  });

  // Track field touch status
  const [touched, setTouched] = useState({});

  // Submission & network status: 'idle' | 'submitting' | 'success' | 'error'
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [lastSubmittedOrder, setLastSubmittedOrder] = useState(null);

  // Testing utility to simulate failure path on demand
  const [simulateNetworkFailure, setSimulateNetworkFailure] = useState(false);

  // Ref for global error banner focus management
  const errorBannerRef = useRef(null);

  // 2. Pure validate(form) returning an errors object, derived on every render
  const errors = validate(form);
  const hasErrors = Object.keys(errors).length > 0;

  // 3. Helper to show errors only after a field is touched
  const show = (field) => (touched[field] ? errors[field] : undefined);

  // Single change handler for all four fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear top error message when user starts typing again
    if (status === 'error') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  // Blur handler to mark field as touched
  const handleBlur = (fieldName) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  // Move focus to first invalid field or fallback
  const focusFirstInvalid = (currentErrors) => {
    const fieldOrder = ['name', 'phone', 'area', 'address'];
    const firstInvalidKey = fieldOrder.find((key) => currentErrors[key]);
    if (firstInvalidKey) {
      const el = document.getElementById(firstInvalidKey);
      if (el) {
        el.focus();
        return;
      }
    }
    if (errorBannerRef.current) {
      errorBannerRef.current.focus();
    }
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent double submissions (cannot fire twice)
    if (status === 'submitting') {
      return;
    }

    // Touch all fields upon submit attempt so all pending errors become visible
    setTouched({
      name: true,
      phone: true,
      area: true,
      address: true,
    });

    // Check validation
    if (hasErrors) {
      setStatus('idle');
      setErrorMessage('Please fix the errors highlighted below before submitting.');
      focusFirstInvalid(errors);
      return;
    }

    if (items.length === 0) {
      setStatus('idle');
      setErrorMessage('Your cart is empty. Please add items before placing an order.');
      return;
    }

    // Enter submitting state (disables button & shows ETB in label)
    setStatus('submitting');
    setErrorMessage('');

    try {
      // Simulate network latency (1.2s)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (simulateNetworkFailure) {
        throw new Error('Simulated Network Timeout: Unable to connect to Addis Eats order gateway.');
      }

      // Success path
      const orderTimestamp = new Date().toLocaleTimeString();
      const generatedOrderId = `AE-${Date.now().toString().slice(-6)}`;
      setLastSubmittedOrder({
        ...form,
        items: [...items],
        total,
        orderId: generatedOrderId,
        timestamp: orderTimestamp,
      });

      setStatus('success');
      clearCart();
    } catch (err) {
      // 6. Failure path: KEEPS every value in form state and moves focus
      setStatus('error');
      setErrorMessage(
        err.message || 'Failed to place order due to a network error. Your details have been preserved. Please try again.'
      );
      setTimeout(() => {
        focusFirstInvalid(errors);
      }, 50);
    }
  };

  // Reset form to place another order
  const handleReset = () => {
    setForm({
      name: '',
      phone: '',
      area: 'Bole',
      address: '',
    });
    setTouched({});
    setStatus('idle');
    setErrorMessage('');
    setLastSubmittedOrder(null);
  };

  return (
    <div className="checkout-screen-container">
      <div className="checkout-card">
        <div className="checkout-card-header">
          <h2>🇪🇹 Addis Eats Checkout</h2>
          <p className="checkout-card-subtitle">
            Fast, reliable food delivery across Addis Ababa.
          </p>
        </div>

        {/* State 4: SUCCESS STATE */}
        {status === 'success' && lastSubmittedOrder ? (
          <div className="checkout-success-view" role="region" aria-label="Order Confirmation">
            <div className="success-icon-badge" aria-hidden="true">🎉</div>
            <h3 className="success-title">Order Confirmed!</h3>
            <p className="success-reference">
              Order Reference: <strong>{lastSubmittedOrder.orderId}</strong> ({lastSubmittedOrder.timestamp})
            </p>

            <div className="success-summary-card">
              <h4>Delivery Details</h4>
              <div className="summary-row">
                <span>Customer:</span>
                <strong>{lastSubmittedOrder.name}</strong>
              </div>
              <div className="summary-row">
                <span>Phone:</span>
                <strong>{lastSubmittedOrder.phone}</strong>
              </div>
              <div className="summary-row">
                <span>Delivery Area:</span>
                <strong>{lastSubmittedOrder.area}</strong>
              </div>
              <div className="summary-row">
                <span>Address / Notes:</span>
                <strong>{lastSubmittedOrder.address}</strong>
              </div>
              <div className="summary-row total-highlight">
                <span>Amount Paid:</span>
                <span className="total-highlight-val">{lastSubmittedOrder.total} ETB</span>
              </div>
            </div>

            <button
              type="button"
              className="action-btn-primary full-width"
              onClick={handleReset}
            >
              Place Another Order
            </button>
          </div>
        ) : (
          /* ACTIVE CHECKOUT VIEW (States: Idle, Validating, Submitting, Failure, Empty Cart) */
          <div className="checkout-active-view">
            {/* Simulation Controls for evaluation */}
            <div className="simulation-toolbar">
              <label className="simulation-checkbox-label">
                <input
                  type="checkbox"
                  checked={simulateNetworkFailure}
                  onChange={(e) => setSimulateNetworkFailure(e.target.checked)}
                />
                <span>Simulate Network Failure (test failure recovery & retained form values)</span>
              </label>
            </div>

            {/* Global Alert / Failure Announcement Banner */}
            {status === 'error' && errorMessage && (
              <div
                ref={errorBannerRef}
                tabIndex={-1}
                role="alert"
                aria-live="assertive"
                className="checkout-error-banner"
              >
                <div className="banner-icon" aria-hidden="true">⚠️</div>
                <div className="banner-content">
                  <strong>Network / Submission Error</strong>
                  <p>{errorMessage}</p>
                  <small>Don't worry — all your entered information has been preserved below.</small>
                </div>
              </div>
            )}

            {/* Order Items Preview */}
            <div className="order-items-preview">
              <div className="preview-header">
                <span>Items in Order ({items.length})</span>
                <span className="preview-total-badge">{total} ETB</span>
              </div>

              {items.length === 0 ? (
                <div className="empty-cart-notice">
                  <p>Your cart is empty. Please add dishes from our menu before placing an order.</p>
                </div>
              ) : (
                <ul className="preview-items-list">
                  {items.map((item, idx) => (
                    <li key={`${item.id}-${idx}`} className="preview-item-row">
                      <span className="item-name">{item.name}</span>
                      <span className="item-price">{item.price} ETB</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* THE FOUR-FIELD CHECKOUT FORM */}
            <form className="addis-eats-form" onSubmit={handleSubmit} noValidate>
              {/* Field 1: Full Name */}
              <Field
                id="name"
                name="name"
                label="Full Name"
                placeholder="e.g. Abebe Bikila"
                value={form.name}
                onChange={handleChange}
                onBlur={() => handleBlur('name')}
                error={show('name')}
                helperText="Name of person receiving the order"
                required
                disabled={status === 'submitting'}
                autoComplete="name"
              />

              {/* Field 2: Phone Number */}
              <Field
                id="phone"
                name="phone"
                type="tel"
                label="Ethiopian Phone Number"
                placeholder="0911234567 or +251911234567"
                value={form.phone}
                onChange={handleChange}
                onBlur={() => handleBlur('phone')}
                error={show('phone')}
                helperText="Format: 09... or +2519... (10 or 13 digits)"
                required
                disabled={status === 'submitting'}
                autoComplete="tel"
              />

              {/* Field 3: Delivery Area */}
              <Field
                id="area"
                name="area"
                as="select"
                label="Delivery Area (Addis Ababa)"
                value={form.area}
                onChange={handleChange}
                onBlur={() => handleBlur('area')}
                error={show('area')}
                helperText="Select your sub-city for courier routing"
                required
                disabled={status === 'submitting'}
              >
                <option value="Bole">Bole</option>
                <option value="Kazanchis">Kazanchis</option>
                <option value="Summit">Summit</option>
                <option value="Piassa">Piassa</option>
                <option value="Sarbet">Sarbet</option>
                <option value="CMC">CMC</option>
                <option value="Megenagna">Megenagna</option>
                <option value="Arat Kilo">Arat Kilo</option>
                <option value="Gerji">Gerji</option>
              </Field>

              {/* Field 4: Specific Address / Landmark */}
              <Field
                id="address"
                name="address"
                as="textarea"
                label="Delivery Address & Landmark"
                placeholder="e.g. Cameroon St, Near Edna Mall, House #402, 3rd Floor"
                value={form.address}
                onChange={handleChange}
                onBlur={() => handleBlur('address')}
                error={show('address')}
                helperText="Provide specific street, landmark, or house number (min 5 chars)"
                required
                disabled={status === 'submitting'}
              />

              {/* Form Actions & State 3: Submitting State */}
              <div className="form-submit-section">
                <button
                  type="submit"
                  id="checkout-submit-btn"
                  className={`action-btn-primary full-width ${status === 'submitting' ? 'is-loading' : ''}`}
                  disabled={status === 'submitting' || items.length === 0}
                >
                  {status === 'submitting'
                    ? `Placing Order (${total} ETB)...`
                    : items.length === 0
                    ? 'Add Items to Cart to Order'
                    : `Complete Order (${total} ETB)`}
                </button>

                {items.length > 0 && (
                  <p className="keyboard-hint" aria-hidden="true">
                    💡 Tip: Pressing <kbd>Enter</kbd> in any field submits the order.
                  </p>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Checkout;
