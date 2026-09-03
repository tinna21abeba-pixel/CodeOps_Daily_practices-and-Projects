import React, { createContext, useContext, useReducer, useMemo } from 'react';
import PropTypes from 'prop-types';
import { cartReducer } from './cartReducer';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Total price is derived on every render from state.items rather than stored in reducer state
  const total = state.items.reduce((sum, item) => sum + item.price, 0);

  // Memoize the context value to avoid unnecessary re-renders of consumers when unrelated parent state changes
  const value = useMemo(
    () => ({
      items: state.items,
      dispatch,
      total,
    }),
    [state.items, total]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to consume CartContext cleanly with validation
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
