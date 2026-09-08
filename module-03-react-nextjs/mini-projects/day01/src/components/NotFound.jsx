import React from 'react';
import { Link } from 'react-router-dom';

/**
 * NotFound Component (404 Catch-All)
 */
function NotFound() {
  return (
    <div className="status-container error-state">
      <h2>404 - Page Not Found</h2>
      <p>The page you requested could not be found.</p>
      <Link to="/" className="secondary-btn">
        ← Back to Home
      </Link>
    </div>
  );
}

export default NotFound;
