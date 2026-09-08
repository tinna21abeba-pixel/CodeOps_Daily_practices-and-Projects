import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Home Component (Landing Page)
 */
function Home() {
  return (
    <div className="home-page">
      <div className="hero-banner">
        <h2>Welcome to Addis Eats 🍽️</h2>
        <p>
          Experience the authentic flavors of Ethiopia. From savory Doro Wet to freshly prepared Tibs and Kitfo, enjoy delightful culinary experiences made with fresh ingredients.
        </p>
        <div className="hero-actions">
          <Link to="/menu" className="submit-order-btn action-link">
            Explore Full Menu →
          </Link>
          <Link to="/cart" className="secondary-btn action-link">
            View Shopping Cart
          </Link>
        </div>
      </div>

      <div className="featured-grid">
        <div className="feature-item">
          <span className="feature-icon">🍲</span>
          <h3>Authentic Dishes</h3>
          <p>Traditional Doro Wet, Kitfo, Shiro, Tibs, and Injera prepared daily.</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🚀</span>
          <h3>Fast Delivery</h3>
          <p>Freshly delivered hot to your doorstep across Addis Ababa.</p>
        </div>
        <div className="feature-item">
          <span className="feature-icon">🔒</span>
          <h3>Secure Checkout</h3>
          <p>Sign in with one click, confirm your phone number and delivery location.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
