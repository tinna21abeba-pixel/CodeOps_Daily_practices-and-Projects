import React from 'react';
import PropTypes from 'prop-types';

/**
 * Skeleton Loader Component
 * Renders an accessible, smooth animated shimmer placeholder during Suspense chunk loading.
 */
export function Skeleton({ type = 'checkout' }) {
  if (type === 'dish') {
    return (
      <div className="skeleton-card" aria-busy="true" aria-label="Loading dish...">
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-badge" />
        <div className="skeleton-line skeleton-text" />
        <div className="skeleton-row">
          <div className="skeleton-line skeleton-price" />
          <div className="skeleton-line skeleton-btn" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="skeleton-container"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading page content..."
    >
      <div className="skeleton-header">
        <div className="skeleton-line skeleton-title shimmer" />
        <div className="skeleton-line skeleton-subtitle shimmer" />
      </div>

      <div className="skeleton-body">
        <div className="skeleton-box preview-box shimmer" />
        <div className="skeleton-form">
          <div className="skeleton-field shimmer" />
          <div className="skeleton-field shimmer" />
          <div className="skeleton-field shimmer" />
          <div className="skeleton-field shimmer" />
          <div className="skeleton-line skeleton-submit shimmer" />
        </div>
      </div>
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );
}

Skeleton.propTypes = {
  type: PropTypes.oneOf(['checkout', 'dish', 'general']),
};

export default Skeleton;
