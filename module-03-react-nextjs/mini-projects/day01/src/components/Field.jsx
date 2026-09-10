import React from 'react';
import PropTypes from 'prop-types';

/**
 * Field Component
 * Accessible, reusable form field component supporting inputs, selects, and textareas.
 *
 * Accessibility & UX Features:
 * 1. Semantic `<label htmlFor={id}>` for every field.
 * 2. `aria-invalid` set dynamically when error is displayed.
 * 3. `aria-describedby` referencing both helper text and error message alerts.
 * 4. `role="alert"` on error containers for immediate screen-reader announcements.
 * 5. Greyscale-friendly: visual warning glyphs (⚠️) and high-contrast styling ensure errors
 *    are clear even without color perception.
 */
function Field({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  helperText,
  placeholder,
  required = false,
  disabled = false,
  as = 'input',
  children,
  autoComplete,
  inputRef,
}) {
  const hasError = Boolean(error);
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  // Build aria-describedby list
  const describedByParts = [];
  if (helperText) describedByParts.push(helperId);
  if (hasError) describedByParts.push(errorId);
  const ariaDescribedBy = describedByParts.length > 0 ? describedByParts.join(' ') : undefined;

  const commonProps = {
    id,
    name,
    value,
    onChange,
    onBlur,
    disabled,
    placeholder,
    autoComplete,
    ref: inputRef,
    'aria-invalid': hasError,
    'aria-describedby': ariaDescribedBy,
    'aria-required': required,
    className: `field-control ${hasError ? 'is-invalid' : ''}`,
  };

  return (
    <div className={`form-field-group ${hasError ? 'has-error' : ''}`}>
      <div className="field-label-wrapper">
        <label htmlFor={id} className="field-label">
          {label}
          {required && (
            <span className="field-required-marker" aria-hidden="true">
              {' '}*
            </span>
          )}
        </label>
        {helperText && (
          <span id={helperId} className="field-helper-text">
            {helperText}
          </span>
        )}
      </div>

      <div className="field-input-container">
        {as === 'select' ? (
          <select {...commonProps}>
            {children}
          </select>
        ) : as === 'textarea' ? (
          <textarea rows={3} {...commonProps} />
        ) : (
          <input type={type} {...commonProps} />
        )}

        {hasError && (
          <span className="field-error-icon" aria-hidden="true">
            ⚠️
          </span>
        )}
      </div>

      {hasError && (
        <p id={errorId} role="alert" aria-live="assertive" className="field-error-message">
          <span className="error-icon-prefix" aria-hidden="true">⚠️ </span>
          <span className="error-text-content">{error}</span>
        </p>
      )}
    </div>
  );
}

Field.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  error: PropTypes.string,
  helperText: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  as: PropTypes.oneOf(['input', 'select', 'textarea']),
  children: PropTypes.node,
  autoComplete: PropTypes.string,
  inputRef: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
};

export default Field;
