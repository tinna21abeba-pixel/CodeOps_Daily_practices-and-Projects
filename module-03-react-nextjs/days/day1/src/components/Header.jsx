import React from "react";
import { useTheme } from "../context/ThemeContext.jsx";
import { useCartStore } from "../store/useCartStore";

function Header({ currentView, onViewChange }) {
  const { theme, toggleTheme } = useTheme();

  const totalItems = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + (item.quantity || 1), 0)
  );

  return (
    <header className="app-header">
      <div className="header-brand" onClick={() => onViewChange("menu")}>
        <span className="brand-icon">🇪🇹</span>
        <div>
          <h1>Taste of Habesha</h1>
          <span className="brand-subtitle">Authentic Ethiopian Cuisine</span>
        </div>
      </div>

      <nav className="header-nav">
        <button
          className={`nav-btn ${currentView === "menu" ? "active" : ""}`}
          onClick={() => onViewChange("menu")}
        >
          Menu
        </button>
        <button
          className={`nav-btn ${currentView === "checkout" ? "active" : ""}`}
          onClick={() => onViewChange("checkout")}
        >
          Checkout
          {totalItems > 0 && <span className="nav-badge">{totalItems}</span>}
        </button>
        <button
          className={`nav-btn ${currentView === "receipt" ? "active" : ""}`}
          onClick={() => onViewChange("receipt")}
        >
          Receipt
        </button>
        <button className="theme-toggle-btn" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </nav>
    </header>
  );
}

export default Header;
