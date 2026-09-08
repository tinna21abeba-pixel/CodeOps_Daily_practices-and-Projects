import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../context/AuthProvider';
import { useTheme } from '../context/ThemeProvider';

function Layout() {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`app-layout theme-${theme}`}>
      <Header />
      <nav className="main-nav" aria-label="Main Navigation">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Home
        </NavLink>
        <NavLink
          to="/menu"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Menu
        </NavLink>
        <NavLink
          to="/cart"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Cart
        </NavLink>
        <NavLink
          to="/checkout"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Checkout
        </NavLink>
        <NavLink
          to="/login"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          {isAuthenticated ? 'Account (Signed In)' : 'Login'}
        </NavLink>
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title="Toggle Theme"
          style={{ marginLeft: 'auto', background: 'transparent', border: '1px solid currentColor', borderRadius: '4px', padding: '0.25rem 0.5rem', cursor: 'pointer' }}
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </nav>

      <main className="main-content-outlet">
        <Outlet />
      </main>

      <footer className="app-footer">
        <p>© 2026 Addis Eats · Authentic Ethiopian Cuisine</p>
      </footer>
    </div>
  );
}

export default Layout;
