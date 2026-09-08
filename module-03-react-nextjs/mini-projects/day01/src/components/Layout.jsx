import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Header from './Header';

/**
 * Layout Component
 * Serves as the top-level parent route frame containing Header, navigation bar,
 * child route outlet, and page footer.
 */
function Layout() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <div className="app-layout">
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
          {isLoggedIn ? 'Account (Signed In)' : 'Login'}
        </NavLink>
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
