import React from 'react';
import { Link } from 'react-router-dom';
import CartBadge from './CartBadge';

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="brand-link">
          <div className="brand-info">
            <h1>Addis <span>Eats</span></h1>
            <p>Authentic Ethiopian Cuisine · Assembled</p>
          </div>
        </Link>
        <Link to="/cart" className="header-cart-link">
          <CartBadge />
        </Link>
      </div>
    </header>
  );
}

export default Header;
