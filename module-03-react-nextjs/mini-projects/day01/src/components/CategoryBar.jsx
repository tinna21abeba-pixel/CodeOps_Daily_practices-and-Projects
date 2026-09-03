import React from 'react';
import PropTypes from 'prop-types';

function CategoryBar({ categories, selected, onSelect }) {
  return (
    <nav className="categor-map" aria-label="Dish Categories">
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          onClick={() => onSelect(category)}
          className={selected.toLowerCase() === category.toLowerCase() ? 'active' : ''}
          aria-pressed={selected.toLowerCase() === category.toLowerCase()}
        >
          {category}
        </button>
      ))}
    </nav>
  );
}

CategoryBar.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default CategoryBar;