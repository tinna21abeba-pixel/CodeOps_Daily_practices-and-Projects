import React from 'react'
import { useTheme } from '../context/ThemeContext.jsx'

function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <h1>Our Dishes</h1>
      <button className="theme-toggle-btn" onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode ({theme})
      </button>
    </header>
  )
}

export default Header

