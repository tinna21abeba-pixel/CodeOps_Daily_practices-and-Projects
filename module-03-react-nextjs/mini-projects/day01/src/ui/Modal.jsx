import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

/**
 * Focusable element selector string for focus trapping
 */
const FOCUSABLE_ELEMENTS_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Generic Accessible Modal rendered with React createPortal
 * Features:
 * - Rendered directly into document.body to escape parent container stacking contexts.
 * - Focus Trap: Tab and Shift+Tab cycle exclusively within modal interactive elements.
 * - Focus Return: Automatically restores focus to the triggering element when closed.
 * - Keyboard Escape: Pressing Escape closes the modal cleanly.
 * - Backdrop click dismissal.
 * - WAI-ARIA compliance (role="dialog", aria-modal="true").
 */
export function Modal({
  isOpen,
  onClose,
  title,
  titleId = 'modal-title',
  children,
  triggerRef,
  className = '',
}) {
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save previous active element for focus return
    previousFocusRef.current = triggerRef?.current || document.activeElement;

    // Prevent body scrolling while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus the close button or first focusable element
    requestAnimationFrame(() => {
      if (closeBtnRef.current) {
        closeBtnRef.current.focus();
      } else if (modalRef.current) {
        const firstFocusable = modalRef.current.querySelector(FOCUSABLE_ELEMENTS_SELECTOR);
        if (firstFocusable) {
          firstFocusable.focus();
        } else {
          modalRef.current.focus();
        }
      }
    });

    // Keyboard handlers: Escape key & Focus Trapping
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        if (!modalRef.current) return;

        const focusableElements = Array.from(
          modalRef.current.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR)
        );

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab: if on first element, wrap to last
          if (document.activeElement === firstElement || document.activeElement === modalRef.current) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: if on last element, wrap to first
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;

      // Focus Return
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) {
    return null;
  }

  const modalContent = (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={`modal-card ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
      >
        <div className="modal-header">
          {title && <h2 id={titleId}>{title}</h2>}
          <button
            ref={closeBtnRef}
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <div className="modal-body-content">{children}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  titleId: PropTypes.string,
  children: PropTypes.node,
  triggerRef: PropTypes.shape({ current: PropTypes.any }),
  className: PropTypes.string,
};

export default Modal;
