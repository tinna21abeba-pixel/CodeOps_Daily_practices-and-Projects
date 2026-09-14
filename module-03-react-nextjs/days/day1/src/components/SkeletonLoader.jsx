import React from "react";

function SkeletonLoader({ type = "checkout" }) {
  if (type === "receipt") {
    return (
      <div className="skeleton-container" aria-label="Loading receipt...">
        <div className="skeleton-line skeleton-title"></div>
        <div className="skeleton-box skeleton-receipt-card">
          <div className="skeleton-line skeleton-w-75"></div>
          <div className="skeleton-line skeleton-w-50"></div>
          <div className="skeleton-line skeleton-w-100"></div>
          <div className="skeleton-line skeleton-w-60"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="skeleton-container" aria-label="Loading checkout...">
      <div className="skeleton-line skeleton-title"></div>
      <div className="skeleton-form-grid">
        <div className="skeleton-box skeleton-form-card">
          <div className="skeleton-line skeleton-w-50"></div>
          <div className="skeleton-input"></div>
          <div className="skeleton-line skeleton-w-50"></div>
          <div className="skeleton-input"></div>
          <div className="skeleton-line skeleton-w-50"></div>
          <div className="skeleton-input"></div>
          <div className="skeleton-btn"></div>
        </div>
        <div className="skeleton-box skeleton-summary-card">
          <div className="skeleton-line skeleton-w-60"></div>
          <div className="skeleton-line skeleton-w-100"></div>
          <div className="skeleton-line skeleton-w-100"></div>
          <div className="skeleton-line skeleton-w-40"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonLoader;
