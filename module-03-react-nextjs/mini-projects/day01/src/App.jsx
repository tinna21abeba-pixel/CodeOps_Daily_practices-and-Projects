import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { ThemeProvider } from './context/ThemeProvider';
import Layout from './components/Layout';
import Home from './components/Home';
import Menu from './components/Menu';
import DishDetail from './components/DishDetail';
import Cart from './components/Cart';
import RequireAuth from './components/RequireAuth';
import Login from './components/Login';
import NotFound from './components/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import {
  MenuUnavailable,
  CartUnavailable,
  CheckoutUnavailable,
  ReceiptUnavailable,
} from './components/Fallbacks';
import Skeleton from './components/Skeleton';

// Lazy-loaded routes for performance & code-splitting
const Checkout = lazy(() => import('./components/Checkout'));
const Receipt = lazy(() => import('./components/Receipt'));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ErrorBoundary regionName="Application Root">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />

                {/* Menu Route with dedicated Error Boundary */}
                <Route
                  path="menu"
                  element={
                    <ErrorBoundary fallback={<MenuUnavailable />} regionName="Menu">
                      <Menu />
                    </ErrorBoundary>
                  }
                />

                {/* Dish Detail Route */}
                <Route
                  path="menu/:id"
                  element={
                    <ErrorBoundary fallback={<MenuUnavailable />} regionName="Dish Details">
                      <DishDetail />
                    </ErrorBoundary>
                  }
                />

                {/* Cart Route with dedicated Error Boundary */}
                <Route
                  path="cart"
                  element={
                    <ErrorBoundary fallback={<CartUnavailable />} regionName="Cart">
                      <Cart />
                    </ErrorBoundary>
                  }
                />

                {/* Lazy-Loaded Checkout Route behind Suspense Skeleton & Error Boundary */}
                <Route
                  path="checkout"
                  element={
                    <ErrorBoundary fallback={<CheckoutUnavailable />} regionName="Checkout">
                      <Suspense fallback={<Skeleton type="checkout" />}>
                        <RequireAuth>
                          <Checkout />
                        </RequireAuth>
                      </Suspense>
                    </ErrorBoundary>
                  }
                />

                {/* Lazy-Loaded Receipt Route behind Suspense Skeleton & Error Boundary */}
                <Route
                  path="receipt"
                  element={
                    <ErrorBoundary fallback={<ReceiptUnavailable />} regionName="Receipt">
                      <Suspense fallback={<Skeleton type="checkout" />}>
                        <Receipt />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="receipt/:orderId"
                  element={
                    <ErrorBoundary fallback={<ReceiptUnavailable />} regionName="Receipt">
                      <Suspense fallback={<Skeleton type="checkout" />}>
                        <Receipt />
                      </Suspense>
                    </ErrorBoundary>
                  }
                />

                <Route path="login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </ErrorBoundary>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
