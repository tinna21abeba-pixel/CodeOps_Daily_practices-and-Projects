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
    errors.area = "Please select a valid delivery area (Bole, Kazanchis, Megenagna, Piassa).";
  }

  return errors;
}

function OrderForm() {
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
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [simulateFailure, setSimulateFailure] = useState(true);

  const nameRef = useRef(null);
  const phoneRef = useRef(null);
  const areaRef = useRef(null);
  const notesRef = useRef(null);

  const fieldRefs = {
    name: nameRef,
    phone: phoneRef,
    area: areaRef,
    notes: notesRef,
  };

  const totalPrice = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0)
  );
  const clearCart = useCartStore((state) => state.clear);

  const errors = validate(form);
  const isValid = Object.keys(errors).length === 0;

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

  function focusFirstBadField(customErrors = errors) {
    const fieldOrder = ["name", "phone", "area", "notes"];
    const firstInvalid = fieldOrder.find((field) => customErrors[field]);
    if (firstInvalid && fieldRefs[firstInvalid]?.current) {
      fieldRefs[firstInvalid].current.focus();
    }
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
      focusFirstBadField(errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      if (simulateFailure) {
        throw new Error(
          "TeleBirr Payment Gateway Error (Code: 504): Failed to authenticate phone number. Please verify your TeleBirr phone details."
        );
      }

      setSubmitSuccess(
        `🎉 Order successfully placed for ${form.name}! Delivery to ${form.area}. TeleBirr receipt sent to ${form.phone}.`
      );
      clearCart();
    } catch (err) {
      setSubmitError(err.message || "Failed to submit request.");
      if (phoneRef.current) {
        phoneRef.current.focus();
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="checkout-container">
      <form onSubmit={handleSubmit} noValidate aria-label="Checkout Form">
        <div className="form-header">
          <h2>TeleBirr Checkout</h2>
          <span className="telebirr-badge">TeleBirr Pay</span>
        </div>

        {submitError && (
          <div className="alert-box error-alert" role="alert">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <strong>Order Failed:</strong>
              <p>{submitError}</p>
            </div>
          </div>
        )}

        {submitSuccess && (
          <div className="alert-box success-alert" role="alert">
            <div className="alert-icon">✅</div>
            <div className="alert-content">
              <strong>Success!</strong>
              <p>{submitSuccess}</p>
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="checkout-name">
            Customer Name <span className="required-star">*</span>
          </label>
          <input
            id="checkout-name"
            ref={nameRef}
            type="text"
            name="name"
            placeholder="e.g. Almaz Bekele"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={touched.name && Boolean(errors.name)}
            aria-describedby={touched.name && errors.name ? "name-error" : undefined}
            className={touched.name && errors.name ? "input-error" : ""}
          />
          {touched.name && errors.name && (
            <span id="name-error" className="field-error" role="alert">
              {errors.name}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="checkout-phone">
            TeleBirr Phone <span className="required-star">*</span>
          </label>
          <input
            id="checkout-phone"
            ref={phoneRef}
            type="tel"
            name="phone"
            placeholder="09... or +2519..."
            value={form.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={touched.phone && Boolean(errors.phone)}
            aria-describedby={touched.phone && errors.phone ? "phone-error" : undefined}
            className={touched.phone && errors.phone ? "input-error" : ""}
          />
          {touched.phone && errors.phone && (
            <span id="phone-error" className="field-error" role="alert">
              {errors.phone}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="checkout-area">
            Delivery Area <span className="required-star">*</span>
          </label>
          <select
            id="checkout-area"
            ref={areaRef}
            name="area"
            value={form.area}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={touched.area && Boolean(errors.area)}
            aria-describedby={touched.area && errors.area ? "area-error" : undefined}
            className={touched.area && errors.area ? "input-error" : ""}
          >
            <option value="Bole">Bole</option>
            <option value="Kazanchis">Kazanchis</option>
            <option value="Megenagna">Megenagna</option>
            <option value="Piassa">Piassa</option>
          </select>
          {touched.area && errors.area && (
            <span id="area-error" className="field-error" role="alert">
              {errors.area}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="checkout-notes">
            Delivery Notes <span className="optional-tag">(Optional)</span>
          </label>
          <textarea
            id="checkout-notes"
            ref={notesRef}
            name="notes"
            rows={3}
            placeholder="e.g. Ring bell, building 3, 2nd floor"
            value={form.notes}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid="false"
          />
        </div>

        <div className="simulation-toggle">
          <label htmlFor="simulate-failure-checkbox" className="toggle-label">
            <input
              id="simulate-failure-checkbox"
              type="checkbox"
              checked={simulateFailure}
              onChange={(e) => setSimulateFailure(e.target.checked)}
            />
            <span>Simulate Failed Request (Requirement 7)</span>
          </label>
          <span className="toggle-hint">
            {simulateFailure ? "⚠️ Will reject with TeleBirr error & focus phone field" : "✅ Normal successful checkout mode"}
          </span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="checkout-btn"
        >
          {isSubmitting
            ? "Processing TeleBirr Payment..."
            : `Pay & Order • ${totalPrice} ETB`}
        </button>
      </form>

      <div className="order-summary-box">
        <h3>Order Summary Preview</h3>
        <p><strong>Customer:</strong> {form.name || "—"}</p>
        <p><strong>TeleBirr Phone:</strong> {form.phone || "—"}</p>
        <p><strong>Delivery Area:</strong> {form.area || "—"}</p>
        <p><strong>Notes:</strong> {form.notes || "None"}</p>
        <p><strong>Total Bill:</strong> <span className="total-highlight">{totalPrice} ETB</span></p>
      </div>
    </div>
  );
}

export default OrderForm;