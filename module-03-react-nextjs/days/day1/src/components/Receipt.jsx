import React, { useMemo } from "react";

const fallbackReceiptData = {
  orderId: "TB-849201",
  customerName: "Abebe Kebede",
  phone: "+251911223344",
  area: "Bole",
  notes: "Deliver promptly",
  items: [
    { id: 1, name: "Doro Wet", price: 250, quantity: 1 },
    { id: 2, name: "Kitfo", price: 350, quantity: 1 }
  ],
  totalPrice: 600,
  timestamp: "12:30:00 PM"
};

function Receipt({ receiptData, onBackToMenu }) {
  const data = useMemo(() => receiptData || fallbackReceiptData, [receiptData]);

  return (
    <div className="receipt-wrapper">
      <div className="receipt-card">
        <div className="receipt-header">
          <div className="receipt-check-icon">✓</div>
          <h2>Payment Confirmed</h2>
          <p className="receipt-subtitle">Thank you for dining with Taste of Habesha</p>
          <span className="receipt-order-badge">Order #{data.orderId}</span>
        </div>

        <div className="receipt-divider"></div>

        <div className="receipt-details-grid">
          <div className="receipt-detail-item">
            <span className="receipt-label">Customer</span>
            <span className="receipt-val">{data.customerName}</span>
          </div>
          <div className="receipt-detail-item">
            <span className="receipt-label">TeleBirr Phone</span>
            <span className="receipt-val">{data.phone}</span>
          </div>
          <div className="receipt-detail-item">
            <span className="receipt-label">Delivery Area</span>
            <span className="receipt-val">{data.area}</span>
          </div>
          <div className="receipt-detail-item">
            <span className="receipt-label">Order Time</span>
            <span className="receipt-val">{data.timestamp || "Just now"}</span>
          </div>
        </div>

        {data.notes && (
          <div className="receipt-notes-box">
            <span className="receipt-label">Notes:</span> {data.notes}
          </div>
        )}

        <div className="receipt-divider"></div>

        <div className="receipt-items-list">
          <h3>Order Summary</h3>
          {data.items && data.items.length > 0 ? (
            data.items.map((item, index) => (
              <div key={item.id || index} className="receipt-item-row">
                <span>
                  {item.name} × {item.quantity || 1}
                </span>
                <span className="receipt-item-price">
                  {item.price * (item.quantity || 1)} ETB
                </span>
              </div>
            ))
          ) : (
            <p className="receipt-empty-note">Items paid via TeleBirr express.</p>
          )}
        </div>

        <div className="receipt-total-row">
          <span>Total Paid</span>
          <span className="receipt-grand-total">{data.totalPrice} ETB</span>
        </div>

        <div className="receipt-footer">
          <button className="receipt-home-btn" onClick={onBackToMenu}>
            ← Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}

export default Receipt;
