import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login, logout, user } = useAuth();
  const destination = location.state?.from?.pathname || '/checkout';

  function handleLogin() {
    login({ name: 'Abebe Bikila' });
    navigate(destination, { replace: true });
  }

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="login-card">
      <h2>Account Login</h2>
      {isAuthenticated ? (
        <div className="auth-card-body">
          <p className="auth-status-success">
            ✅ You are currently signed in{user?.name ? ` as ${user.name}` : ''}.
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
