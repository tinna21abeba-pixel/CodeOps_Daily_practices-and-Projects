import React, { useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

/**
 * Receipt Route Component - Lazy Loaded behind Suspense
 */
export function Receipt() {
  const { orderId } = useParams();
  const location = useLocation();
  const [hasDeliberateError, setHasDeliberateError] = useState(false);

  // Deliberate error tester for receipt boundary testing
  if (hasDeliberateError) {
    throw new Error('Deliberate rendering failure triggered inside Receipt component.');
  }

  // Retrieve order passed via location state or create memoized fallback receipt
  const order = React.useMemo(() => {
    if (location.state?.order) return location.state.order;
    return {
      orderId: orderId || 'AE-894210',
      timestamp: '12:30 PM',
      name: 'Abebe Bikila',
      phone: '+251911234567',
      area: 'Bole',
      address: 'Cameroon St, Near Edna Mall, House #402',
      total: 600,
      items: [
        { id: 1, name: 'Doro Wet', price: 250 },
        { id: 2, name: 'Kitfo', price: 350 },
      ],
    };
  }, [location.state, orderId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="receipt-screen-container">
      <div className="receipt-card">
        {/* Deliberate error testing toolbar */}
        <div className="simulation-toolbar compact">
          <button
            type="button"
            className="deliberate-error-btn"
            onClick={() => setHasDeliberateError(true)}
            title="Throw deliberate error to test Receipt ErrorBoundary"
          >
            💥 Simulate Receipt Crash
          </button>
        </div>

        <div className="receipt-header">
          <div className="receipt-badge" aria-hidden="true">🧾</div>
          <h2>Official Addis Eats Receipt</h2>
          <p className="receipt-subtitle">Thank you for dining with Addis Eats!</p>
          <div className="receipt-order-ref">
            <span>Order Number: </span>
            <strong>{order.orderId}</strong>
          </div>
          <p className="receipt-time">Placed at: {order.timestamp}</p>
        </div>

        <div className="receipt-divider" />

        <div className="receipt-section">
          <h3>Customer & Delivery Information</h3>
          <div className="receipt-grid">
            <div className="receipt-row">
              <span className="label">Customer Name:</span>
              <span className="value">{order.name}</span>
            </div>
            <div className="receipt-row">
              <span className="label">Phone:</span>
              <span className="value">{order.phone}</span>
            </div>
            <div className="receipt-row">
              <span className="label">Delivery Area:</span>
              <span className="value">{order.area}</span>
            </div>
            <div className="receipt-row">
              <span className="label">Address / Landmark:</span>
              <span className="value">{order.address}</span>
            </div>
          </div>
        </div>

        <div className="receipt-divider" />

        <div className="receipt-section">
          <h3>Dishes Ordered</h3>
          <table className="receipt-table">
            <thead>
              <tr>
                <th>Item</th>
                <th className="text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, idx) => (
                <tr key={`${item.id}-${idx}`}>
                  <td>{item.name}</td>
                  <td className="text-right">{item.price} ETB</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th>Total Paid (ETB)</th>
                <th className="text-right total-cell">{order.total} ETB</th>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="receipt-divider" />

        <div className="receipt-footer-actions no-print">
          <button
            type="button"
            className="action-btn-primary print-btn"
            onClick={handlePrint}
          >
            🖨️ Print Receipt
          </button>
          <Link to="/menu" className="secondary-btn action-link">
            🍲 Browse Menu
          </Link>
          <Link to="/" className="secondary-btn action-link">
            🏠 Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Receipt;
