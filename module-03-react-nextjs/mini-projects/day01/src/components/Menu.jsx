import React, { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import Dish from './Dish';
import CategoryBar from './CategoryBar';
import { useFetch } from '../hooks/useFetch';
import { useCartStore } from '../cartStore';

const CATEGORIES = ['All', 'main', 'side'];

function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'All';

  const [searchTerm, setSearchTerm] = useState('');
  const [shouldCrashMenu, setShouldCrashMenu] = useState(false);
  const searchInputRef = useRef(null);

  const addItem = useCartStore((state) => state.addItem);

  // Stable callback for adding dish, ensuring React.memo on Dish doesn't break
  const handleAddToCart = useCallback((dish) => {
    addItem(dish);
  }, [addItem]);

  // Auto-focus search input when menu mounts
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Deliberate error throw to test Menu region ErrorBoundary
  if (shouldCrashMenu) {
    throw new Error('Deliberate rendering failure triggered in Menu region.');
  }

  const { data, loading, error } = useFetch('/dishes.json');

  function handleSelectCategory(cat) {
    if (cat.toLowerCase() === 'all') {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('category');
      setSearchParams(newParams);
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('category', cat);
      setSearchParams(newParams);
    }
  }

  // Filter dishes based on category from query string and search input
  const filteredDishes = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter((dish) => {
      const dishCategory = (dish.catagory || dish.category || '').toLowerCase();
      const matchesCategory =
        selectedCategory.toLowerCase() === 'all' ||
        dishCategory === selectedCategory.toLowerCase();

      const matchesSearch = dish.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase().trim());

      return matchesCategory && matchesSearch;
    });
  }, [data, selectedCategory, searchTerm]);

  return (
    <div className="menu-wrapper">
      {/* Simulation toolbar for testing Error Boundaries */}
      <div className="simulation-toolbar">
        <button
          type="button"
          className="deliberate-error-btn"
          onClick={() => setShouldCrashMenu(true)}
          title="Throw deliberate error to test Menu ErrorBoundary"
        >
          💥 Crash Menu Region (Test Isolation)
        </button>
        <span className="simulation-hint">
          Click to prove Menu failure doesn't take down Cart or Header
        </span>
      </div>

      <div className="menu-controls">
        <div className="search-box-container">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search Ethiopian dishes (e.g., Kitfo, Tibs)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            aria-label="Search dishes"
          />
        </div>

        <CategoryBar
          categories={CATEGORIES}
          selected={selectedCategory}
          onSelect={handleSelectCategory}
        />
      </div>

      <div className="menu-status-area">
        {loading && (
          <div className="status-container loading-state">
            <div className="spinner" />
            <p>Loading authentic dishes...</p>
          </div>
        )}

        {error && !loading && (
          <div className="status-container error-state">
            <p>⚠️ {error}</p>
          </div>
        )}

        {!loading && !error && filteredDishes.length === 0 && (
          <div className="status-container empty-state">
            <p>
              No dishes found matching category &quot;{selectedCategory}&quot;
              {searchTerm ? ` and search &quot;${searchTerm}&quot;` : ''}.
            </p>
          </div>
        )}

        {!loading && !error && filteredDishes.length > 0 && (
          <div className="dishes-grid">
            {filteredDishes.map((dish) => (
              <Dish key={dish.id} dish={dish} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;
