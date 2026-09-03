import React from 'react';
import { CartProvider } from './context/CartProvider';
import Header from './components/Header';
import Menu from './components/Menu';
import CheckoutPanel from './components/CheckoutPanel';

function App() {
  return (
    <CartProvider>
      <div className="app-layout">
        <Header />
        <main className="content-container">
          <section className="menu-container-section">
            <Menu />
          </section>
          <aside className="checkout-sidebar-section">
            <CheckoutPanel />
          </aside>
        </main>
      </div>
    </CartProvider>
  );
}

export default App;
