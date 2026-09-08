import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('isLoggedIn');
    return saved === 'true' ? { name: 'Abebe Bikila' } : null;
  });

  const login = (userData = { name: 'Abebe Bikila' }) => {
    localStorage.setItem('isLoggedIn', 'true');
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    setUser(null);
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
