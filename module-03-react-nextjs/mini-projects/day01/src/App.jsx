import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartProvider';
import Layout from './components/Layout';
import Home from './components/Home';
import Menu from './components/Menu';
import DishDetail from './components/DishDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import RequireAuth from './components/RequireAuth';
import Login from './components/Login';
import NotFound from './components/NotFound';

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<Menu />} />
            <Route path="menu/:id" element={<DishDetail />} />
            <Route path="cart" element={<Cart />} />
            <Route
              path="checkout"
              element={
                <RequireAuth>
                  <Checkout />
                </RequireAuth>
              }
            />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
