import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * ErrorBoundary component to catch JavaScript errors anywhere in child component trees,
 * log those errors, and display a fallback UI instead of crashing the whole application.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    // Automatically reset if resetKey changes
    if (
      this.props.resetKey !== undefined &&
      prevProps.resetKey !== this.props.resetKey &&
      this.state.hasError
    ) {
      this.resetErrorBoundary();
    }
  }

  resetErrorBoundary = () => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { fallback, children, regionName = 'This section' } = this.props;

    if (hasError) {
      // 1. If fallback is a function / render prop
      if (typeof fallback === 'function') {
        return fallback({
          error,
          errorInfo,
          resetErrorBoundary: this.resetErrorBoundary,
        });
      }

      // 2. If fallback is a React element
      if (React.isValidElement(fallback)) {
        return React.cloneElement(fallback, {
          error,
          resetErrorBoundary: this.resetErrorBoundary,
        });
      }

      // 3. Default accessible fallback UI
      return (
        <div
          className="error-boundary-fallback"
          role="alert"
          aria-live="assertive"
        >
          <div className="error-fallback-icon" aria-hidden="true">
            ⚠️
          </div>
          <div className="error-fallback-content">
            <h3 className="error-fallback-title">{regionName} failed to load</h3>
            <p className="error-fallback-message">
              {error?.message || 'An unexpected rendering error occurred in this component.'}
            </p>
            <p className="error-fallback-note">
              The rest of the Addis Eats application remains fully active and working.
            </p>
            <div className="error-fallback-actions">
              <button
                type="button"
                className="action-btn-primary retry-btn"
                onClick={this.resetErrorBoundary}
              >
                🔄 Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  onError: PropTypes.func,
  onReset: PropTypes.func,
  resetKey: PropTypes.any,
  regionName: PropTypes.string,
};

export default ErrorBoundary;
