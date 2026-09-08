import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

/**
 * Login Component
 * Handles authentication status, remembering the user's intended destination.
 */
function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const destination = location.state?.from?.pathname || '/checkout';

  function handleLogin() {
    localStorage.setItem('isLoggedIn', 'true');
    navigate(destination, { replace: true });
  }

  function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    navigate('/login', { replace: true });
  }

  return (
    <div className="login-card">
      <h2>Account Login</h2>
      {isLoggedIn ? (
        <div className="auth-card-body">
          <p className="auth-status-success">
            ✅ You are currently signed in.
          </p>
          <div className="login-actions">
            <Link to="/checkout" className="submit-order-btn action-link">
              Proceed to Checkout
            </Link>
            <button
              type="button"
              className="secondary-btn"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        </div>
      ) : (
        <div className="auth-card-body">
          <p className="auth-status-desc">
            Sign in to access the checkout and confirm your order delivery.
          </p>
          <button
            type="button"
            className="submit-order-btn"
            onClick={handleLogin}
          >
            Sign In with 1-Click
          </button>
        </div>
      )}
    </div>
  );
}

export default Login;
