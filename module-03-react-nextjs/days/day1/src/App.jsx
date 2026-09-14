import React, { useState, useCallback, useRef, lazy, Suspense } from "react";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import Header from "./components/Header.jsx";
import Main from "./components/Main.jsx";
import DishModal from "./components/DishModal.jsx";
import SkeletonLoader from "./components/SkeletonLoader.jsx";
import ProfilerPanel from "./components/ProfilerPanel.jsx";
import { useCartStore } from "./store/useCartStore";

const Checkout = lazy(() => import("./components/Checkout.jsx"));
const Receipt = lazy(() => import("./components/Receipt.jsx"));

function AppContent() {
  const [currentView, setCurrentView] = useState("menu");
  const [selectedDish, setSelectedDish] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [crashedDishId, setCrashedDishId] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [isOptimized, setIsOptimized] = useState(true);

  const modalTriggerRef = useRef(null);
  const profilerLogsRef = useRef([]);

  const addItem = useCartStore((state) => state.addItem);

  const handleOpenDishModal = useCallback((dish, triggerRef) => {
    modalTriggerRef.current = triggerRef?.current || null;
    setSelectedDish(dish);
    setIsModalOpen(true);
  }, []);

  const handleCloseDishModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleTriggerDishCrash = useCallback((dishId) => {
    setCrashedDishId(dishId);
  }, []);

  const handleResetMenuCrash = useCallback(() => {
    setCrashedDishId(null);
  }, []);

  const handleProfilerRender = useCallback(
    (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
      const newLog = {
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        timestamp: new Date().toLocaleTimeString(),
      };
      profilerLogsRef.current = [...profilerLogsRef.current.slice(-49), newLog];
    },
    []
  );

  const handleAddThreeDishes = useCallback(() => {
    const sampleDishes = [
      { id: 1, name: "Doro Wet", price: 250, catagory: "main", isSpicy: true },
      { id: 2, name: "Kitfo", price: 350, catagory: "main", isSpicy: true },
      { id: 3, name: "Shiro", price: 150, catagory: "side", isSpicy: false },
    ];
    sampleDishes.forEach((d) => addItem(d));
  }, [addItem]);

  const handleCheckoutComplete = useCallback((receipt) => {
    setReceiptData(receipt);
    setCurrentView("receipt");
  }, []);

  return (
    <div className="app-layout">
      <Header currentView={currentView} onViewChange={setCurrentView} />

      <div className="app-main-container">
        {currentView === "menu" && (
          <Main
            onOpenDishModal={handleOpenDishModal}
            crashedDishId={crashedDishId}
            onTriggerCrash={handleTriggerDishCrash}
            onResetMenuCrash={handleResetMenuCrash}
            onGoToCheckout={() => setCurrentView("checkout")}
            onProfilerRender={handleProfilerRender}
          />
        )}

        {currentView === "checkout" && (
          <Suspense fallback={<SkeletonLoader type="checkout" />}>
            <Checkout
              onComplete={handleCheckoutComplete}
              onCancel={() => setCurrentView("menu")}
            />
          </Suspense>
        )}

        {currentView === "receipt" && (
          <Suspense fallback={<SkeletonLoader type="receipt" />}>
            <Receipt
              receiptData={receiptData}
              onBackToMenu={() => setCurrentView("menu")}
            />
          </Suspense>
        )}
      </div>

      <DishModal
        dish={selectedDish}
        isOpen={isModalOpen}
        onClose={handleCloseDishModal}
        onAddToCart={addItem}
        triggerRef={modalTriggerRef}
      />

      <ProfilerPanel
        profilerLogsRef={profilerLogsRef}
        onAddThreeDishes={handleAddThreeDishes}
        isOptimized={isOptimized}
        onToggleOptimization={() => setIsOptimized((prev) => !prev)}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;