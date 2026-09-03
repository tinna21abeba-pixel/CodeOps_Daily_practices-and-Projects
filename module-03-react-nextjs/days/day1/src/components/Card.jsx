import React from 'react'
import { useTheme } from '../context/ThemeContext'

function Card({ children }) {
  const { theme } = useTheme();

  return (
    <div className={`card ${theme === 'dark' ? 'card-dark' : 'card-light'}`}>
      {children}
    </div>
  )
}

export default Card