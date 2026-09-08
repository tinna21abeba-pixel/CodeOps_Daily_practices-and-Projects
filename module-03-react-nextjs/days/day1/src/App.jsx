import React from 'react'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import Header from './components/Header.jsx'
import Main from './components/Main.jsx'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Header />
          <Main />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App