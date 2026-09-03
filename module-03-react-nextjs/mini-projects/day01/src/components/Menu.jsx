import React, { useState, useRef, useEffect, useMemo } from 'react';
import Dish from './Dish';
import CategoryBar from './CategoryBar';
import { useFetch } from '../hooks/useFetch';

const CATEGORIES = ['All', 'main', 'side'];

function Menu() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);

  // Auto-focus search input when the menu mounts
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Category filter dynamically drives the fetch URL; AbortController in useFetch cancels any in-flight request
  const endpoint =
    selectedCategory === 'All'
      ? '/dishes.json'
      : `/dishes.json?category=${encodeURIComponent(selectedCategory.toLowerCase())}`;

  const { data, loading, error } = useFetch(endpoint);

  // Deliberate useMemo: memoize filtered dishes list across category and search term changes
  const filteredDishes = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter((dish) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        dish.catagory?.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = dish.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase().trim());
      return matchesCategory && matchesSearch;
    });
  }, [data, selectedCategory, searchTerm]);

  return (
    <div className="menu-wrapper">
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
          onSelect={setSelectedCategory}
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
            <p>No dishes found matching &quot;{searchTerm || selectedCategory}&quot;.</p>
          </div>
        )}

        {!loading && !error && filteredDishes.length > 0 && (
          <div className="dishes-grid">
            {filteredDishes.map((dish) => (
              <Dish key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;
