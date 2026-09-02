import React, { useState, useEffect, useRef } from "react";
import Dish from "./Dish";
import CategoryBar from "./CategoryBar";
import OrderForm from "./OrderForm";

const categories = ["All", "main", "side"];

function Main() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const searchInputRef = useRef(null);

  // Focus search input on mount
  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  // Fetch dishes whenever selectedCategory changes, with AbortController cancellation
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    const endpoint =
      selectedCategory === "All"
        ? "/dishes.json"
        : `/dishes.json?category=${encodeURIComponent(selectedCategory.toLowerCase())}`;

    fetch(endpoint, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Unable to load menu (Status: ${res.status}). Please try again later.`
          );
        }
        return res.json();
      })
      .then((data) => {
        const filtered =
          selectedCategory === "All"
            ? data
            : data.filter(
                (dish) =>
                  dish.catagory?.toLowerCase() === selectedCategory.toLowerCase()
              );
        setDishes(filtered);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(
            err.message || "Something went wrong while fetching the menu."
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [selectedCategory]);

  function handleAdd(price) {
    setTotalPrice((prevTotal) => prevTotal + price);
  }

  function handleTotalItems() {
    setTotalItems((prevCount) => prevCount + 1);
  }

  const displayedDishes = dishes.filter((dish) =>
    dish.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  // Separate loading, error, and empty states rendered with early returns
  function renderContent() {
    if (loading) {
      return (
        <div className="status-container loading-state">
          <div className="spinner"></div>
          <p>Loading dishes...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="status-container error-state">
          <p>⚠️ {error}</p>
        </div>
      );
    }

    if (displayedDishes.length === 0) {
      return (
        <div className="status-container empty-state">
          <p>No dishes found matching your selection.</p>
        </div>
      );
    }

    return (
      <div className="menu-container">
        {displayedDishes.map((dish) => (
          <Dish
            key={dish.id}
            name={dish.name}
            price={dish.price}
            catagory={dish.catagory}
            isSpicy={dish.isSpicy}
            onAdd={handleAdd}
            onItem={handleTotalItems}
          />
        ))}
      </div>
    );
  }

  return (
    <main className="menu-container">
      <h3>Number of Selected Items: {totalItems}</h3>
      <h2>Total price: {totalPrice} ETB</h2>

      <div className="search-box-container">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search dishes by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <CategoryBar
        categorys={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <p>Selected Category: {selectedCategory}</p>

      {renderContent()}

      <OrderForm />
    </main>
  );
}

export default Main;