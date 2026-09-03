import React from 'react';
import CartBadge from './CartBadge';

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand-info">
          <h1>Addis <span>Eats</span></h1>
          <p>Authentic Ethiopian Cuisine · Assembled</p>
        </div>
        <CartBadge />
      </div>
    </header>
  );
}

export default Header;
