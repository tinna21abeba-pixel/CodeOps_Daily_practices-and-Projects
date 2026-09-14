import React, { useState, useRef } from "react";
import { useCartStore } from "../store/useCartStore";

function validate(form) {
  const errors = {};

  if (!form.name || !form.name.trim()) {
    errors.name = "Full name is required.";
  } else if (form.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters long.";
  }

  const telebirrRegex = /^(\+251|0)?[97]\d{8}$/;
  if (!form.phone || !form.phone.trim()) {
    errors.phone = "TeleBirr phone number is required.";
  } else if (!telebirrRegex.test(form.phone.trim())) {
    errors.phone = "Enter a valid TeleBirr number (e.g., 0912345678 or +251912345678).";
  }

  const allowedAreas = ["Bole", "Kazanchis", "Megenagna", "Piassa"];
  if (!form.area || !allowedAreas.includes(form.area)) {
    errors.area = "Please select a valid delivery area.";
  }

  return errors;
}

function Checkout({ onComplete, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    area: "Bole",
    notes: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    phone: false,
    area: false,
    notes: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [simulateFailure, setSimulateFailure] = useState(false);

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const areaRef = useRef(null);

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const errors = validate(form);
  const isValid = Object.keys(errors).length === 0 && items.length > 0;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (submitError) setSubmitError(null);
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setTouched({
      name: true,
      phone: true,
      area: true,
      notes: true,
    });

    if (!isValid) {
      if (errors.name && nameRef.current) nameRef.current.focus();
      else if (errors.phone && phoneRef.current) phoneRef.current.focus();
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (simulateFailure) {
        throw new Error(
          "TeleBirr Gateway Timeout: Network communication failed. Please check your credentials."
        );
      }

      const receiptData = {
        orderId: "TB-" + Math.floor(100000 + Math.random() * 900000),
        customerName: form.name,
        phone: form.phone,
        area: form.area,
        notes: form.notes,
        items: [...items],
        totalPrice: totalPrice,
        timestamp: new Date().toLocaleTimeString(),
      };

      clearCart();
      if (onComplete) {
        onComplete(receiptData);
      }
    } catch (err) {
      setSubmitError(err.message || "Checkout submission failed.");
      if (phoneRef.current) {
        phoneRef.current.focus();
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="checkout-view-wrapper">
      <div className="checkout-nav-bar">
        <button className="back-btn" onClick={onCancel}>
          ← Return to Menu
        </button>
        <h2>Complete Your Order</h2>
      </div>

      <div className="checkout-container">
        <form onSubmit={handleSubmit} noValidate aria-label="Checkout Form">
          <div className="form-header">
            <h2>TeleBirr Payment</h2>
            <span className="telebirr-badge">TeleBirr Pay</span>
          </div>

          {submitError && (
            <div className="alert-box error-alert" role="alert">
              <div className="alert-icon">⚠️</div>
              <div className="alert-content">
                <strong>Payment Error:</strong>
                <p>{submitError}</p>
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="checkout-name">
              Full Name <span className="required-star">*</span>
            </label>
            <input
              id="checkout-name"
              ref={nameRef}
              type="text"
              name="name"
              placeholder="e.g. Liya Kebede"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.name && errors.name ? "input-error" : ""}
            />
            {touched.name && errors.name && (
              <span className="field-error" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="checkout-phone">
              TeleBirr Mobile <span className="required-star">*</span>
            </label>
            <input
              id="checkout-phone"
              ref={phoneRef}
              type="tel"
              name="phone"
              placeholder="0911223344"
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={touched.phone && errors.phone ? "input-error" : ""}
            />
            {touched.phone && errors.phone && (
              <span className="field-error" role="alert">
                {errors.phone}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="checkout-area">
              Delivery Destination <span className="required-star">*</span>
            </label>
            <select
              id="checkout-area"
              ref={areaRef}
              name="area"
              value={form.area}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="Bole">Bole</option>
              <option value="Kazanchis">Kazanchis</option>
              <option value="Megenagna">Megenagna</option>
              <option value="Piassa">Piassa</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="checkout-notes">
              Special Instructions <span className="optional-tag">(Optional)</span>
            </label>
            <textarea
              id="checkout-notes"
              name="notes"
              rows={2}
              placeholder="Add apartment / landmarks"
              value={form.notes}
              onChange={handleChange}
            />
          </div>

          <div className="simulation-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={simulateFailure}
                onChange={(e) => setSimulateFailure(e.target.checked)}
              />
              <span>Simulate Gateway Failure</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isValid || items.length === 0}
            className="checkout-btn"
          >
            {isSubmitting
              ? "Processing TeleBirr..."
              : `Confirm & Pay ${totalPrice} ETB`}
          </button>
        </form>

        <div className="order-summary-box">
          <h3>Order Items ({items.length})</h3>
          {items.length === 0 ? (
            <p className="cart-empty-text">Your cart is empty.</p>
          ) : (
            <div className="checkout-items-mini">
              {items.map((item) => (
                <div key={item.id} className="checkout-item-mini-row">
                  <span>
                    {item.name} × {item.quantity || 1}
                  </span>
                  <span>{item.price * (item.quantity || 1)} ETB</span>
                </div>
              ))}
            </div>
          )}

          <div className="receipt-divider"></div>
          <p>
            <strong>Customer:</strong> {form.name || "—"}
          </p>
          <p>
            <strong>Phone:</strong> {form.phone || "—"}
          </p>
          <p>
            <strong>Area:</strong> {form.area}
          </p>
          <p>
            <strong>Grand Total:</strong>{" "}
            <span className="total-highlight">{totalPrice} ETB</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
