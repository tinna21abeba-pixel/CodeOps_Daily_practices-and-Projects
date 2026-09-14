import React, { Profiler } from "react";
import Menu from "./Menu";
import CartPanel from "./CartPanel";
import ErrorBoundary from "./ErrorBoundary";

function Main({
  onOpenDishModal,
  crashedDishId,
  onTriggerCrash,
  onResetMenuCrash,
  onGoToCheckout,
  onProfilerRender,
}) {
  return (
    <main className="main-content-layout">
      <section className="menu-column">
        <div className="section-title-wrap">
          <h2>Our Traditional Dishes</h2>
          <span className="section-tag">Fresh Daily</span>
        </div>

        <Profiler id="MenuComponent" onRender={onProfilerRender}>
          <ErrorBoundary
            onReset={onResetMenuCrash}
            fallback={(error, reset) => (
              <div className="boundary-fallback menu-fallback" role="alert">
                <div className="fallback-header">
                  <span className="fallback-icon">⚠️</span>
                  <h3>Menu Error Caught by Boundary</h3>
                </div>
                <p className="fallback-msg">
                  {error?.message || "An unexpected error occurred in the menu section."}
                </p>
                <div className="fallback-actions">
                  <button className="retry-action-btn" onClick={reset}>
                    Restore Menu
                  </button>
                </div>
              </div>
            )}
          >
            <Menu
              onOpenDishModal={onOpenDishModal}
              crashedDishId={crashedDishId}
              onTriggerCrash={onTriggerCrash}
            />
          </ErrorBoundary>
        </Profiler>
      </section>

      <aside className="cart-column">
        <Profiler id="CartPanelComponent" onRender={onProfilerRender}>
          <ErrorBoundary
            fallback={(error, reset) => (
              <div className="boundary-fallback cart-fallback" role="alert">
                <div className="fallback-header">
                  <span className="fallback-icon">🛒⚠️</span>
                  <h3>Cart Error Caught Independently</h3>
                </div>
                <p className="fallback-msg">
                  {error?.message || "An error occurred inside the Cart panel."}
                </p>
                <div className="fallback-actions">
                  <button className="retry-action-btn" onClick={reset}>
                    Reset Cart Boundary
                  </button>
                </div>
              </div>
            )}
          >
            <CartPanel onGoToCheckout={onGoToCheckout} />
          </ErrorBoundary>
        </Profiler>
      </aside>
    </main>
  );
}

export default Main;